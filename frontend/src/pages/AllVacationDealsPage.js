import { useEffect, useState } from "react";
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
  const [destinationFilters, setDestinationFilters] = useState([]);
  const [holidayTypeFilters, setHolidayTypeFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: "",
    destinations: [],
    holidayTypes: [],
  });

  // Fetch vacation deals data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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
        };

        const dealsData = await api.post("/api/search", searchPayload);
        setDeals(dealsData.hotels || []);

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

  // Handle search submission
  const handleSearch = (data) => {
    setSearchParams({
      query: data.query || "",
      destinations: data.destinations || [],
      holidayTypes: data.holidayTypes || [],
    });
  };

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
        <AllVacationDealsResultsSection
          deals={deals}
          destinationFilters={destinationFilters}
          holidayTypeFilters={holidayTypeFilters}
        />
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
