import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

const BOARD_BASIS_MAP = {
  "-1": "All Board Basis",
  "2":  "Self Catering",
  "3":  "Half Board",
  "4":  "Full Board",
  "5":  "All Inclusive",
  "6":  "Catered Chalet",
  "8":  "Bed & Breakfast",
  "9":  "Room Only",
  "12": "Club Hotel"
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseHotelStayInfo(apiUrl) {
  if (!apiUrl || typeof apiUrl !== "string") {
    return { minDuration: null, boardBasis: null };
  }

  const raw = apiUrl.trim();
  const query = raw.includes("?") ? raw.split("?").slice(1).join("?") : raw;
  const normalizedQuery = query.startsWith("?") ? query.slice(1) : query;
  const params = new URLSearchParams(normalizedQuery);

  const minDurationRaw =
    params.get("min_duration") ||
    params.get("durationMin") ||
    params.get("duration_min");

  const boardBasisRaw =
    params.get("board_basis") ||
    params.get("boardBasis") ||
    params.get("boardType") ||
    params.get("board");

  const minDuration = (() => {
    const value = Number(minDurationRaw);
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.round(value);
  })();

  const boardBasis = (() => {
    if (!boardBasisRaw) return null;
    const normalized = boardBasisRaw.trim();
    if (!normalized) return null;
    return BOARD_BASIS_MAP[normalized] || normalized;
  })();

  return { minDuration, boardBasis };
}
