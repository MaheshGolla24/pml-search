import React from "react";
import PropTypes from "prop-types";
import {
  PriceRangeFilter,
  RatingFilter,
  DestinationFilter,
  HolidayTypeFilter,
} from "./FilterSections";

/**
 * FiltersSidebar Component
 * Main sidebar containing all filter sections
 * Manages visibility on mobile, sticky positioning on desktop
 */
function FiltersSidebar({
  showFilters,
  minPrice,
  maxPrice,
  priceRange,
  onPriceMinChange,
  onPriceMaxChange,
  ratingOptions,
  selectedRatings,
  onRatingChange,
  destinations,
  selectedDestinations,
  showAllDestinations,
  onShowAllDestinationsChange,
  onDestinationChange,
  holidayTypes,
  selectedHolidayTypes,
  onHolidayTypeChange,
  onClearAllFilters,
}) {
  return (
    <aside
      className={`${
        showFilters ? "block" : "hidden"
      } lg:block max-h-[calc(100vh-214px)] h-fit overflow-y-auto rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300 p-3 sm:p-4 lg:sticky lg:top-[111px] lg:z-[15]`}
    >
      <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2.5 sm:pb-3.5">
        <h2 className="text-sm sm:text-base font-bold text-[#1F1F1F] flex items-center gap-2">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClearAllFilters}
          className="text-[10px] sm:text-xs font-semibold text-[#CB2187] hover:text-[#A11A6C] transition-colors"
        >
          Clear all
        </button>
      </div>

      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedMinPrice={priceRange[0]}
        selectedMaxPrice={priceRange[1]}
        onMinChange={onPriceMinChange}
        onMaxChange={onPriceMaxChange}
      />

      <RatingFilter
        ratingOptions={ratingOptions}
        selectedRatings={selectedRatings}
        onChange={onRatingChange}
      />

      <DestinationFilter
        destinations={destinations}
        selectedDestinations={selectedDestinations}
        showAll={showAllDestinations}
        onShowAllChange={onShowAllDestinationsChange}
        onChange={onDestinationChange}
      />

      <HolidayTypeFilter
        holidayTypes={holidayTypes}
        selectedHolidayTypes={selectedHolidayTypes}
        onChange={onHolidayTypeChange}
      />
    </aside>
  );
}

FiltersSidebar.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  onPriceMinChange: PropTypes.func.isRequired,
  onPriceMaxChange: PropTypes.func.isRequired,
  ratingOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRatings: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRatingChange: PropTypes.func.isRequired,
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  selectedDestinations: PropTypes.arrayOf(PropTypes.string).isRequired,
  showAllDestinations: PropTypes.bool.isRequired,
  onShowAllDestinationsChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
  holidayTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedHolidayTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onHolidayTypeChange: PropTypes.func.isRequired,
  onClearAllFilters: PropTypes.func.isRequired,
};

export default FiltersSidebar;
