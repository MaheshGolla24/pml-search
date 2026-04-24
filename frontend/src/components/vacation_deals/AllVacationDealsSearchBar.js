import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Globe2, Search, Tag } from "lucide-react";
import { useFilterOptions } from "@/hooks/useSearch";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useStickySearchBar } from "@/hooks/useStickySearchBar";

/**
 * SearchField Component
 * Reusable search input field with dropdown results
 * Used for both destination and deal type searches
 */
const SearchField = forwardRef(
  (
    {
      icon: Icon,
      label,
      placeholder,
      query,
      onQueryChange,
      onFocus,
      results,
      isOpen,
      onResultSelect,
      showDropdown,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="group relative flex-1 w-full flex items-center rounded-lg sm:rounded-2xl md:rounded-3xl px-2 sm:px-5 py-3 sm:py-5
        transition-all hover:bg-pml-primary
        [.sticky-search-active_&]:py-2
        [.sticky-search-active_&]:rounded-full"
      >
        {/* Icon */}
        <div className="mr-2 sm:mr-4 rounded-full bg-[#f6eaf2] p-1.5 sm:p-2.5 text-[#cb2187] flex-shrink-0 
        [.sticky-search-active_&]:p-2">
          <Icon
            size={18}
            className="sm:w-[22px] sm:h-[22px] 
            [.sticky-search-active_&]:w-[18px] 
            [.sticky-search-active_&]:h-[18px]"
          />
        </div>

        {/* Input Container */}
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 [.sticky-search-active_&]:text-[8px] 
          [.sticky-search-active_&]:mb-0">
            {label}
          </label>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            className="w-full bg-transparent text-sm sm:text-lg font-semibold text-black placeholder:text-gray-400 outline-none [.sticky-search-active_&]:text-sm [.sticky-search-active_&]:sm:text-sm"
          />
        </div>

        {/* Dropdown */}
        {isOpen && results.length > 0 && showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={result.value}>
                  <button
                    type="button"
                    onClick={() => onResultSelect(result.label)}
                    className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-[#f6eaf2] hover:text-[#cb2187] transition-colors"
                  >
                    {result.label}
                    {result.count && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({result.count})
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SearchField.displayName = "SearchField";

SearchField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResultSelect: PropTypes.func.isRequired,
  showDropdown: PropTypes.bool,
};

SearchField.defaultProps = {
  showDropdown: true,
};

/**
 * SearchButton Component
 * Submit button for the search bar with icon
 */
function SearchButton({ onClick, type = "submit" }) {
  return (
    <div className="w-full md:w-auto pt-1 sm:pt-2 md:pt-0 [.sticky-search-active_&]:pt-0">
      <button
        type={type}
        onClick={onClick}
        className="group w-full md:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#cb2187] to-[#9c1866] hover:from-[#b01e78] 
        hover:to-[#8a1459] text-white font-bold text-xs sm:text-base md:text-lg tracking-wide px-6 sm:px-12 py-4 sm:py-6 rounded-full 
        shadow-lg hover:shadow-xl transition-all active:scale-[0.985] [.sticky-search-active_&]:py-4 [.sticky-search-active_&]:px-8 [.sticky-search-active_&]:text-sm"
      >
        <Search
          size={18}
          className="sm:w-[22px] sm:h-[22px] [.sticky-search-active_&]:w-[18px] [.sticky-search-active_&]:h-[18px]"
        />
        <span>Search</span>
      </button>
    </div>
  );
}

SearchButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

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
