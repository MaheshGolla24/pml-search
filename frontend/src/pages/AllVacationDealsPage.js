import { useEffect, useState, useRef, useCallback } from "react";
import AllVacationDealsSearchBar from "@/components/vacation_deals/AllVacationDealsSearchBar";
import AllVacationDealsResultsSection from "@/components/vacation_deals/AllVacationDealsResultsSection";
import api from "@/lib/api";

/**
 * BreadcrumbBar Component
 * Navigation breadcrumb for page context
 */
function BreadcrumbBar() {
  return (
    <section className="w-full bg-white border-b border-[#e8e8e8]">
      <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[10px] md:py-[12px]">
        <div className="w-full max-w-[1280px] mx-auto">
          <nav className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#7a7a7a]">
            <a
              href="/"
              className="hover:text-[#CB2187] transition-colors no-underline text-[#7a7a7a]"
            >
              Home
            </a>
            <span>&gt;</span>
            <span className="text-[#4c4c4c] font-semibold">
              All Vacation Deals
            </span>
          </nav>
        </div>
      </div>
    </section>
  );
}

/**
 * AllVacationDealsPage Component
 * Main page for displaying vacation deals with search and filtering
 */
export default function AllVacationDealsPage() {
  const [deals, setDeals] = useState([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [destinationFilters, setDestinationFilters] = useState([]);
  const [holidayTypeFilters, setHolidayTypeFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);
  const searchTokenRef = useRef("");
  const [searchParams, setSearchParams] = useState({
    query: "",
    destinations: [],
    holidayTypes: [],
  });

  // Fetch vacation deals data with pagination
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        pageRef.current = 1;
        searchTokenRef.current = "";

        // Fetch vacation deals using the search endpoint
        // Backend expects comma-separated strings for array values
        const searchPayload = {
          q: searchParams.query || "",
          destinations: searchParams.destinations.join(",") || "",
          holiday_types: searchParams.holidayTypes.join(",") || "",
          rating: "",
          price_min: 0,
          price_max: 1000000,
          sort: "best",
          page: 1,
          page_size: 20,
        };

        const dealsData = await api.post("/api/search", searchPayload);
        setDeals(dealsData.hotels || []);
        setTotalDeals(dealsData.total || 0);
        setHasMore(dealsData.has_more || false);
        searchTokenRef.current = dealsData.search_token || "";

        // Fetch filter options if not already set
        if (destinationFilters.length === 0 || holidayTypeFilters.length === 0) {
          try {
            const optionsData = await api.get("/api/filter-options");
            setDestinationFilters(optionsData.destinations || []);
            setHolidayTypeFilters(optionsData.holiday_types || []);
          } catch (optionsErr) {
            console.warn("Failed to fetch filter options:", optionsErr);
          }
        }
      } catch (err) {
        console.error("Error fetching vacation deals:", err);
        setError(err.message || "Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Load more deals for pagination
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = pageRef.current + 1;

      const searchPayload = {
        q: searchParams.query || "",
        destinations: searchParams.destinations.join(",") || "",
        holiday_types: searchParams.holidayTypes.join(",") || "",
        rating: "",
        price_min: 0,
        price_max: 1000000,
        sort: "best",
        page: nextPage,
        page_size: 20,
      };

      // Use search token if available for consistent results
      if (searchTokenRef.current) {
        searchPayload.search_token = searchTokenRef.current;
      }

      const dealsData = await api.post("/api/search", searchPayload);
      setDeals((prev) => [...prev, ...(dealsData.hotels || [])]);
      setHasMore(dealsData.has_more || false);
      if (dealsData.search_token) {
        searchTokenRef.current = dealsData.search_token;
      }
      pageRef.current = nextPage;
    } catch (err) {
      console.error("Error loading more deals:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, searchParams]);

  // Handle search submission
  const handleSearch = (data) => {
    setSearchParams({
      query: data.query || "",
      destinations: data.destinations || [],
      holidayTypes: data.holidayTypes || [],
    });
  };

  // Infinite scroll sentinel ref
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        loadMore();
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  return (
    <div
      data-testid="all-vacation-deals-page"
      className="min-h-screen bg-white font-['Montserrat'] relative"
    >
      {/* Breadcrumb Navigation */}
      <BreadcrumbBar />

      {/* Search Bar with Pink Background */}
      <div className="w-full bg-gradient-to-r from-[#CB2187] to-[#E63A9D] py-6 md:py-8 lg:py-10">
        <AllVacationDealsSearchBar onSearch={handleSearch} />
      </div>

      {/* Loading State */}
      {loading && !deals.length ? (
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[32px] md:py-[48px]">
          <div className="w-full max-w-[1280px] mx-auto text-center">
            <div className="inline-block">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        // Error State
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[32px] md:py-[48px]">
          <div className="w-full max-w-[1280px] mx-auto">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-700 font-semibold mb-2">
                Error Loading Deals
              </p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Results Section
        <div>
          <AllVacationDealsResultsSection
            deals={deals}
            destinationFilters={destinationFilters}
            holidayTypeFilters={holidayTypeFilters}
          />
          
          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4 w-full" />
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-8">
              <div className="w-full max-w-[1280px] mx-auto text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#CB2187]"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* "SPEAK TO OUR TRAVEL EXPERT" Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#CB2187] to-[#A11A6C] hover:from-[#A11A6C] hover:to-[#8B0F56] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base"
          onClick={() => {
            // Handle click - could open a modal or redirect to contact page
            console.log("Travel expert button clicked");
          }}
        >
          <span>💬</span>
          <span className="whitespace-nowrap">SPEAK TO OUR TRAVEL EXPERT</span>
        </button>
      </div>
    </div>
  );
}
