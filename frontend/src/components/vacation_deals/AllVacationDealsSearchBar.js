import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Globe2, Tag } from "lucide-react";
import { useFilterOptions } from "@/hooks/useSearch";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useStickySearchBar } from "@/hooks/useStickySearchBar";
import SearchField from "./SearchField";
import SearchButton from "./SearchButton";

/**
 * AllVacationDealsSearchBar Component
 * Main search bar with destination and deal type dropdowns
 * Features sticky positioning, click-outside handling, and search submission
 */
function AllVacationDealsSearchBar({
  initialQuery = "",
  initialDestinations = [],
  initialHolidayTypes = [],
  onSearch,
}) {
  // Refs
  const sentinelRef = useRef(null);
  const destinationWrapperRef = useRef(null);
  const dealTypeWrapperRef = useRef(null);

  // State Management
  const [destinationQuery, setDestinationQuery] = useState(initialQuery);
  const [dealTypeQuery, setDealTypeQuery] = useState("");
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);
  const [isDealDropdownOpen, setIsDealDropdownOpen] = useState(false);

  // Custom Hooks
  const { options } = useFilterOptions();
  useStickySearchBar(sentinelRef);

  // Close dropdowns when clicking outside
  useClickOutside({
    refs: [destinationWrapperRef, dealTypeWrapperRef],
    callback: () => {
      setIsDestinationDropdownOpen(false);
      setIsDealDropdownOpen(false);
    },
  });

  // Sync with initial props
  useEffect(() => {
    setDestinationQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialDestinations && initialDestinations.length > 0) {
      setDestinationQuery(initialDestinations[0]);
    }
  }, [initialDestinations]);

  useEffect(() => {
    if (initialHolidayTypes && initialHolidayTypes.length > 0) {
      setDealTypeQuery(initialHolidayTypes[0]);
    }
  }, [initialHolidayTypes]);

  // Normalize queries for filtering
  const normalizedDestinationQuery = destinationQuery.trim().toLowerCase();
  const normalizedDealTypeQuery = dealTypeQuery.trim().toLowerCase();

  // Filter destination results
  const destinationResults = useMemo(() => {
    if (!normalizedDestinationQuery) return options?.destinations || [];
    return (options?.destinations || []).filter((destination) =>
      destination.label.toLowerCase().includes(normalizedDestinationQuery)
    );
  }, [normalizedDestinationQuery, options?.destinations]);

  // Filter deal type results
  const dealResults = useMemo(() => {
    if (!normalizedDealTypeQuery) return options?.holiday_types || [];
    return (options?.holiday_types || []).filter((offer) =>
      offer.label.toLowerCase().includes(normalizedDealTypeQuery)
    );
  }, [normalizedDealTypeQuery, options?.holiday_types]);

  // Event Handlers
  const handleDestinationSelect = (label) => {
    setDestinationQuery(label);
    setIsDestinationDropdownOpen(false);
  };

  const handleDealSelect = (label) => {
    setDealTypeQuery(label);
    setIsDealDropdownOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch({
        query: destinationQuery,
        destinations: destinationQuery ? [destinationQuery] : [],
        holidayTypes: dealTypeQuery ? [dealTypeQuery] : [],
      });
    }
  };

  return (
    <>
      {/* Sentinel element for sticky detection */}
      <div ref={sentinelRef} aria-hidden className="h-[1px] w-full" />

      {/* Sticky container */}
      <div
        className="search-sticky -mt-6 md:-mt-8 lg:-mt-14 z-30 px-3 sm:px-4 
        sticky top-[100px] sm:top-[110px] md:top-[120px] lg:top-[92px] 
        [.sticky-search-active_&]:top-0 
        [.sticky-search-active_&]:bg-gradient-to-r 
        [.sticky-search-active_&]:from-[#CB2187] 
        [.sticky-search-active_&]:to-[#E63A9D]
        [.sticky-search-active_&]:backdrop-blur-xl 
        [.sticky-search-active_&]:border-b 
        [.sticky-search-active_&]:border-gray-200/60 
        [.sticky-search-active_&]:shadow-sm 
        [.sticky-search-active_&]:pt-2
        [.sticky-search-active_&]:transition-colors 
        [.sticky-search-active_&]:duration-300"
      >
        <div className="search-inner mx-auto w-full max-w-[1280px] px-2 pb-4 sm:px-6 lg:px-10 lg:pb-4 [.sticky-search-active_&]:pb-2">
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-[2.5rem] 
         shadow-[0_10px_30px_-8px_rgba(0,0,0,0.15)] sm:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.25)]
          border border-white/80 
          flex flex-col md:flex-row items-center gap-2
            px-3 py-2 md:px-5 md:py-3 min-h-[26px] md:min-h-[46px] transition-all 
          duration-300 ease-out 

            [.sticky-search-active_&]:bg-white/95
            [.sticky-search-active_&]:backdrop-blur-xl 
            [.sticky-search-active_&]:border-gray-200/60 
            [.sticky-search-active_&]:shadow-md
            [.sticky-search-active_&]:rounded-full 
            [.sticky-search-active_&]:px-4
            [.sticky-search-active_&]:py-4
            [.sticky-search-active_&]:min-h-[58px] 
            [.sticky-search-active_&]:gap-2"
          >
            {/* Destination Field */}
            <SearchField
              ref={destinationWrapperRef}
              icon={Globe2}
              label="WHERE TO?"
              placeholder="All Destinations"
              query={destinationQuery}
              onQueryChange={(value) => {
                setDestinationQuery(value);
                setIsDestinationDropdownOpen(true);
              }}
              onFocus={() => setIsDestinationDropdownOpen(true)}
              results={destinationResults}
              isOpen={isDestinationDropdownOpen}
              onResultSelect={handleDestinationSelect}
            />

            {/* Divider */}
            <div className="hidden md:block h-10 sm:h-12 md:h-14 w-px bg-gray-200/70 mx-1 sm:mx-2 [.sticky-search-active_&]:h-6" />

            {/* Deal Type Field */}
            <SearchField
              ref={dealTypeWrapperRef}
              icon={Tag}
              label="LOOKING FOR?"
              placeholder="All Deal Types"
              query={dealTypeQuery}
              onQueryChange={(value) => {
                setDealTypeQuery(value);
                setIsDealDropdownOpen(true);
              }}
              onFocus={() => setIsDealDropdownOpen(true)}
              results={dealResults}
              isOpen={isDealDropdownOpen}
              onResultSelect={handleDealSelect}
            />

            {/* Search Button */}
            <SearchButton type="submit" />
          </form>
        </div>
      </div>
    </>
  );
}

AllVacationDealsSearchBar.propTypes = {
  initialQuery: PropTypes.string,
  initialDestinations: PropTypes.arrayOf(PropTypes.string),
  initialHolidayTypes: PropTypes.arrayOf(PropTypes.string),
  onSearch: PropTypes.func,
};

AllVacationDealsSearchBar.defaultProps = {
  initialQuery: "",
  initialDestinations: [],
  initialHolidayTypes: [],
  onSearch: null,
};

export default AllVacationDealsSearchBar;
