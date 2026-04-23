from fastapi import FastAPI, APIRouter, Body, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from typing import Optional, List
import os
import logging
import sqlite3
import time
import hashlib
import json
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

DB_PATH = ROOT_DIR / 'db.sqlite3'

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --------------- IN-MEMORY CACHE ---------------
_cache = {}
CACHE_TTL = 300  # 5 minutes
_search_tokens = {}
SEARCH_TOKEN_TTL = 900  # 15 minutes


def _cache_key(prefix: str, params: dict) -> str:
    raw = json.dumps(params, sort_keys=True, default=str)
    return f"{prefix}:{hashlib.sha256(raw.encode()).hexdigest()}"


def _get_cached(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry['ts']) < CACHE_TTL:
        return entry['data']
    return None


def _set_cached(key: str, data):
    _cache[key] = {'data': data, 'ts': time.time()}
    if len(_cache) > 500:
        cutoff = time.time() - CACHE_TTL
        stale = [k for k, v in _cache.items() if v['ts'] < cutoff]
        for k in stale:
            del _cache[k]


def _cleanup_search_tokens():
    cutoff = time.time() - SEARCH_TOKEN_TTL
    stale = [k for k, v in _search_tokens.items() if v['ts'] < cutoff]
    for k in stale:
        del _search_tokens[k]


def _base_search_payload(params: "SearchParams") -> dict:
    return {
        "q": params.q,
        "destinations": params.destinations,
        "holiday_types": params.holiday_types,
        "rating": params.rating,
        "price_min": params.price_min,
        "price_max": params.price_max,
        "sort": params.sort,
    }


def _issue_search_token(params: "SearchParams") -> str:
    _cleanup_search_tokens()
    token = secrets.token_urlsafe(24)
    _search_tokens[token] = {
        'payload': _base_search_payload(params),
        'ts': time.time(),
    }
    return token


def _resolve_search_token(token: str) -> Optional[dict]:
    _cleanup_search_tokens()
    entry = _search_tokens.get(token)
    if not entry:
        return None
    entry['ts'] = time.time()
    return entry['payload']


# --------------- DB HELPER ---------------
def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


# --------------- RESPONSE MODELS ---------------
class HotelCard(BaseModel):
    id: int
    slug: str
    hotel_name: str
    hotelKey: str
    api_url: str
    offer_header: str
    location: str
    starting_price: float
    Tax_per_night: Optional[float] = None
    property_rating: str
    hotel_destinations: str
    hotel_holidaystyles: str
    hotel_offer_type: str
    hotel_cordinates: str
    card_image: str
    thumbnail_1: str
    saveuptotext: str
    offer_on_card: str
    offer_tag_type: str
    info_paragraph: str
    intro_text: str
    trip_advisor_rating: str
    trip_advisor_reviews: str
    trip_advisor_reviews_rating: Optional[float] = None
    headline_review: str


class FilterOptions(BaseModel):
    destinations: List[dict]
    holiday_types: List[dict]
    ratings: List[str]
    price_min: float
    price_max: float
    total_count: int


class SearchResponse(BaseModel):
    hotels: List[HotelCard]
    total: int
    page: int
    page_size: int
    has_more: bool
    search_token: str


class SearchParams(BaseModel):
    q: Optional[str] = None
    destinations: Optional[str] = None
    holiday_types: Optional[str] = None
    rating: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    sort: str = "best"
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=50)
    search_token: Optional[str] = None


# --------------- QUERY BUILDER HELPERS ---------------
LIGHT_FIELDS = """
    id, slug, hotel_name, hotelKey, api_url, offer_header, location,
    starting_price, Tax_per_night, property_rating, hotel_destinations, hotel_holidaystyles,
    hotel_cordinates,
    card_image, thumbnail_1, saveuptotext, offer_on_card,
    offer_tag_type, info_paragraph, intro_text,
    trip_advisor_rating, trip_advisor_reviews,
    trip_advisor_reviews_rating, headline_review
"""

SORT_MAP = {
    "best": "CASE WHEN saveuptotext != '' THEN 0 ELSE 1 END, starting_price ASC",
    "price_asc": "starting_price ASC",
    "price_desc": "starting_price DESC",
    "rating_desc": "CAST(property_rating AS REAL) DESC, starting_price ASC",
    "newest": "created_at DESC",
}


def _normalize_csv_values(raw: Optional[str]) -> List[str]:
    if not raw:
        return []

    seen = set()
    normalized = []
    for part in raw.split(","):
        token = part.strip().lower()
        if token and token not in seen:
            seen.add(token)
            normalized.append(token)
    return normalized


def _csv_any_match_condition(column: str, token_count: int) -> str:
    base_expr = (
        f"',' || lower(REPLACE(REPLACE(COALESCE({column}, ''), ', ', ','), ' ,', ',')) || ','"
    )
    checks = [f"INSTR({base_expr}, ',' || ? || ',') > 0" for _ in range(token_count)]
    return f"({' OR '.join(checks)})"


def _build_where(params: SearchParams):
    """Build WHERE conditions and bind parameters from search params."""
    conditions = ["hotel_status = 1"]
    binds = []

    if params.q:
        conditions.append("(hotel_name LIKE ? OR location LIKE ? OR offer_header LIKE ?)")
        binds.extend([f"%{params.q}%"] * 3)

    if params.destinations:
        dest_list = _normalize_csv_values(params.destinations)
        if dest_list:
            conditions.append(_csv_any_match_condition("hotel_destinations", len(dest_list)))
            binds.extend(dest_list)

    if params.holiday_types:
        ht_list = _normalize_csv_values(params.holiday_types)
        if ht_list:
            conditions.append(_csv_any_match_condition("hotel_holidaystyles", len(ht_list)))
            binds.extend(ht_list)

    if params.rating:
        r_list = [r.strip() for r in params.rating.split(",") if r.strip()]
        if r_list:
            conditions.append(f"property_rating IN ({','.join(['?'] * len(r_list))})")
            binds.extend(r_list)

    if params.price_min is not None:
        conditions.append("starting_price >= ?")
        binds.append(params.price_min)

    if params.price_max is not None:
        conditions.append("starting_price <= ?")
        binds.append(params.price_max)

    return " AND ".join(conditions), binds


def _row_to_hotel(r) -> HotelCard:
    """Convert a DB row to a HotelCard model."""
    return HotelCard(
        id=r["id"],
        slug=r["slug"],
        hotel_name=r["hotel_name"],
        hotelKey=r["hotelKey"] or "",
        api_url=r["api_url"] or "",
        offer_header=r["offer_header"] or "",
        location=r["location"] or "",
        starting_price=float(r["starting_price"]) if r["starting_price"] else 0,
        Tax_per_night=float(r["Tax_per_night"]) if r["Tax_per_night"] is not None else None,
        property_rating=r["property_rating"] or "",
        hotel_destinations=r["hotel_destinations"] or "",
        hotel_holidaystyles=r["hotel_holidaystyles"] or "",
        hotel_offer_type=r["hotel_holidaystyles"] or "",
        hotel_cordinates=r["hotel_cordinates"] or "",
        card_image=r["card_image"] or "",
        thumbnail_1=r["thumbnail_1"] or "",
        saveuptotext=r["saveuptotext"] or "",
        offer_on_card=r["offer_on_card"] or "",
        offer_tag_type=r["offer_tag_type"] or "",
        info_paragraph=r["info_paragraph"] or "",
        intro_text=r["intro_text"] or "",
        trip_advisor_rating=r["trip_advisor_rating"] or "",
        trip_advisor_reviews=r["trip_advisor_reviews"] or "",
        trip_advisor_reviews_rating=float(r["trip_advisor_reviews_rating"]) if r["trip_advisor_reviews_rating"] else None,
        headline_review=r["headline_review"] or "",
    )


# --------------- FILTER OPTIONS ENDPOINT ---------------
@api_router.get("/filter-options", response_model=FilterOptions)
async def get_filter_options():
    ck = _cache_key("filter-options", {})
    cached = _get_cached(ck)
    if cached:
        return cached

    conn = get_db()
    try:
        c = conn.cursor()

        c.execute("""
            WITH RECURSIVE dest_tokens(hotel_id, token, rest) AS (
                SELECT id, '', COALESCE(hotel_destinations, '') || ','
                FROM pmlapp_hoteldetails
                WHERE hotel_status=1 AND hotel_destinations != ''
                UNION ALL
                SELECT
                    hotel_id,
                    trim(substr(rest, 1, instr(rest, ',') - 1)),
                    substr(rest, instr(rest, ',') + 1)
                FROM dest_tokens
                WHERE rest != ''
            )
            SELECT lower(token) AS value, COUNT(DISTINCT hotel_id) AS cnt
            FROM dest_tokens
            WHERE token != ''
            GROUP BY lower(token)
            ORDER BY cnt DESC, value ASC
        """)
        destinations = [
            {"value": r["value"], "label": r["value"].replace("-", " ").title(), "count": r["cnt"]}
            for r in c.fetchall()
        ]

        c.execute("""
            WITH RECURSIVE holiday_tokens(hotel_id, token, rest) AS (
                SELECT id, '', COALESCE(hotel_holidaystyles, '') || ','
                FROM pmlapp_hoteldetails
                WHERE hotel_status=1 AND hotel_holidaystyles != ''
                UNION ALL
                SELECT
                    hotel_id,
                    trim(substr(rest, 1, instr(rest, ',') - 1)),
                    substr(rest, instr(rest, ',') + 1)
                FROM holiday_tokens
                WHERE rest != ''
            )
            SELECT lower(token) AS value, COUNT(DISTINCT hotel_id) AS cnt
            FROM holiday_tokens
            WHERE token != ''
            GROUP BY lower(token)
            ORDER BY cnt DESC, value ASC
        """)
        holiday_types = [
            {"value": r["value"], "label": r["value"].replace("-", " ").title(), "count": r["cnt"]}
            for r in c.fetchall()
        ]

        c.execute("SELECT DISTINCT property_rating FROM pmlapp_hoteldetails WHERE hotel_status=1 AND property_rating != '' ORDER BY property_rating DESC")
        ratings = [r["property_rating"] for r in c.fetchall()]

        c.execute("SELECT MIN(starting_price), MAX(starting_price) FROM pmlapp_hoteldetails WHERE hotel_status=1")
        price_row = c.fetchone()
        price_min = float(price_row[0]) if price_row[0] else 0
        price_max = float(price_row[1]) if price_row[1] else 10000

        c.execute("SELECT COUNT(*) FROM pmlapp_hoteldetails WHERE hotel_status=1")
        total_count = c.fetchone()[0]

        result = FilterOptions(
            destinations=destinations, holiday_types=holiday_types,
            ratings=ratings, price_min=price_min, price_max=price_max,
            total_count=total_count,
        )
        _set_cached(ck, result)
        return result
    finally:
        conn.close()


def _execute_search(params: SearchParams) -> SearchResponse:
    request_token = (params.search_token or "").strip()
    search_token = request_token

    if request_token:
        payload = _resolve_search_token(request_token)
        if not payload:
            raise HTTPException(status_code=400, detail="Invalid or expired search token")
        effective_params = SearchParams(
            **payload,
            page=params.page,
            page_size=params.page_size,
        )
    else:
        effective_params = SearchParams(**_base_search_payload(params), page=params.page, page_size=params.page_size)
        search_token = _issue_search_token(effective_params)

    ck = _cache_key("search", effective_params.model_dump())
    cached = _get_cached(ck)
    if cached:
        cached.search_token = search_token
        return cached

    where_clause, binds = _build_where(effective_params)
    order_by = SORT_MAP.get(effective_params.sort, SORT_MAP["best"])
    offset = (effective_params.page - 1) * effective_params.page_size

    conn = get_db()
    try:
        c = conn.cursor()

        c.execute(f"SELECT COUNT(*) FROM pmlapp_hoteldetails WHERE {where_clause}", binds)
        total = c.fetchone()[0]

        c.execute(
            f"SELECT {LIGHT_FIELDS} FROM pmlapp_hoteldetails WHERE {where_clause} ORDER BY {order_by} LIMIT ? OFFSET ?",
            binds + [effective_params.page_size, offset],
        )
        hotels = [_row_to_hotel(r) for r in c.fetchall()]

        result = SearchResponse(
            hotels=hotels, total=total, page=effective_params.page,
            page_size=effective_params.page_size, has_more=(offset + effective_params.page_size) < total,
            search_token=search_token,
        )
        _set_cached(ck, result)
        return result
    finally:
        conn.close()


# --------------- SEARCH ENDPOINT ---------------
@api_router.post("/search", response_model=SearchResponse)
async def search_hotels(params: SearchParams = Body(...)):
    return _execute_search(params)


@api_router.get("/health")
async def health():
    return {"status": "ok", "hotels_db": str(DB_PATH.exists())}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=list({
        *[o.strip() for o in os.environ.get('CORS_ORIGINS', '*').split(',') if o.strip()],
        "https://93tjqrxs-3000.inc1.devtunnels.ms",
        "https://93tjqrxs-3000.inc1.devtunnels.ms/",
    }),
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
