import React from "react";
import PropTypes from "prop-types";

/**
 * ResultsHeader Component
 * Displays deal count, selected destination badges, and sort selector
 */
function ResultsHeader({
  dealCount,
  selectedDestinations,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl border 
              border-[#E8E8E8] bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 sm:p-6 lg:sticky lg:top-[111px] 
              lg:z-[15] 
              [.sticky-search-active_&]:top-[100px] 
              [.sticky-search-active_&]:md:top-[100px] 
              [.sticky-search-active_&]:lg:top-[100px]">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        {/* Deals Count */}
        <div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F1F1F]">
            {dealCount} Deals Found
          </h2>
          <p className="text-[10px] sm:text-xs text-[#7C7C7C]">
            Perfect vacation deals for you
          </p>
        </div>

        {/* Selected Destination Badges */}
        {selectedDestinations.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {selectedDestinations.slice(0, 6).map((label) => (
              <span
                key={label}
                className="rounded-full bg-gradient-to-r from-[#FBEAF4] to-[#FDE6F2] px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[#CB2187] border border-[#F6D5E8] max-w-full truncate"
              >
                {label}
              </span>
            ))}
            {selectedDestinations.length > 6 ? (
              <span className="rounded-full bg-[#FFF0F7] px-2 py-1 text-[10px] sm:text-xs font-semibold text-[#CB2187] border border-[#F6D5E8]">
                +{selectedDestinations.length - 6} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Sort Selector */}
      <div className="relative w-fit ml-auto">
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="appearance-none rounded-full border border-[#DDDDDD] bg-white px-4 py-2 pr-10 text-sm font-medium text-[#2B2B2B] outline-none hover:border-[#CB2187] focus:border-[#CB2187] focus:ring-1 focus:ring-[#CB2187]/20 transition-all"
        >
          <option value="best-deals">Best Deals</option>
          <option value="price-low-to-high">Price: Low to High</option>
          <option value="price-high-to-low">Price: High to Low</option>
        </select>

        {/* Dropdown Icon */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

ResultsHeader.propTypes = {
  dealCount: PropTypes.number.isRequired,
  selectedDestinations: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortBy: PropTypes.oneOf(["best-deals", "price-low-to-high", "price-high-to-low"])
    .isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default ResultsHeader;
