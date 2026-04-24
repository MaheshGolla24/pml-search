import React from "react";
import PropTypes from "prop-types";
import { formatPrice } from "./utils";

/**
 * Price Range Filter Component
 * Dual-range slider for filtering deals by price
 */
function PriceRangeFilter({
  minPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  onMinChange,
  onMaxChange,
}) {
  const rangeLeft =
    maxPrice > minPrice
      ? ((selectedMinPrice - minPrice) / (maxPrice - minPrice)) * 100
      : 0;
  const rangeRight =
    maxPrice > minPrice
      ? 100 - ((selectedMaxPrice - minPrice) / (maxPrice - minPrice)) * 100
      : 0;

  return (
    <div className="border-b border-[#ECECEC] py-3 sm:py-4">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
        Price Range
      </p>
      <div className="relative pt-3">
        <div className="relative h-1 rounded-full bg-[#F0B7D5]">
          <div
            className="absolute h-1 rounded-full bg-[#CB2187]"
            style={{ left: `${rangeLeft}%`, right: `${rangeRight}%` }}
          />
        </div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step="0.01"
          value={selectedMinPrice}
          onChange={onMinChange}
          className="pointer-events-none absolute left-0 top-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#CB2187] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(203,33,135,0.12)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#CB2187] [&::-moz-range-thumb]:bg-white"
        />

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step="0.01"
          value={selectedMaxPrice}
          onChange={onMaxChange}
          className="pointer-events-none absolute left-0 top-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#CB2187] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(203,33,135,0.12)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#CB2187] [&::-moz-range-thumb]:bg-white"
        />
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs text-[#7C7C7C]">
        <span>£{formatPrice(selectedMinPrice)}</span>
        <span>£{formatPrice(selectedMaxPrice)}</span>
      </div>
    </div>
  );
}

PriceRangeFilter.propTypes = {
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  selectedMinPrice: PropTypes.number.isRequired,
  selectedMaxPrice: PropTypes.number.isRequired,
  onMinChange: PropTypes.func.isRequired,
  onMaxChange: PropTypes.func.isRequired,
};

/**
 * Rating Filter Component
 * Checkbox list of available property ratings
 */
function RatingFilter({ ratingOptions, selectedRatings, onChange }) {
  const handleChange = (rating) => {
    onChange(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((value) => value !== rating)
        : [...selectedRatings, rating]
    );
  };

  return (
    <div className="border-b border-[#ECECEC] py-3 sm:py-4">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
        Rating
      </p>
      <div className="space-y-1.5 sm:space-y-2">
        {ratingOptions.length > 0 ? (
          ratingOptions.map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-[#666]"
            >
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleChange(rating)}
                className="h-3.5 sm:h-4 w-3.5 sm:w-4 rounded border-[#D5D5D5]"
              />
              <span>{rating} Stars</span>
            </label>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-[#888]">
            No rating filters available
          </p>
        )}
      </div>
    </div>
  );
}

RatingFilter.propTypes = {
  ratingOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRatings: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Destination Filter Component
 * Checkbox list of destinations with optional "Show more" functionality
 */
function DestinationFilter({
  destinations,
  selectedDestinations,
  showAll,
  onShowAllChange,
  onChange,
}) {
  const handleToggle = (label) => {
    onChange(
      selectedDestinations.includes(label)
        ? selectedDestinations.filter((item) => item !== label)
        : [...selectedDestinations, label]
    );
  };

  const displayedDestinations = showAll ? destinations : destinations.slice(0, 8);

  return (
    <div className="border-b border-[#ECECEC] py-3 sm:py-4">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
        Destinations
      </p>
      <div
        className={
          showAll
            ? "max-h-56 space-y-1.5 sm:space-y-2 overflow-y-auto pr-1"
            : "space-y-1.5 sm:space-y-2"
        }
      >
        {destinations.length > 0 ? (
          displayedDestinations.map((destination) => (
            <label
              key={destination.href}
              className="flex cursor-pointer items-center justify-between gap-2 text-xs sm:text-sm text-[#666]"
            >
              <span className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDestinations.includes(destination.label)}
                  onChange={() => handleToggle(destination.label)}
                  className="h-3.5 sm:h-4 w-3.5 sm:w-4 rounded border-[#D5D5D5]"
                />
                <span>{destination.label}</span>
              </span>
              {destination.count != null ? (
                <span className="text-[10px] sm:text-[11px] text-[#999]">
                  {destination.count}
                </span>
              ) : null}
            </label>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-[#888]">
            No destinations available
          </p>
        )}
      </div>
      {destinations.length > 8 ? (
        <button
          type="button"
          onClick={() => onShowAllChange(!showAll)}
          className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold text-[#CB2187]"
        >
          {showAll ? "Show less" : `Show all (${destinations.length})`}
        </button>
      ) : null}
    </div>
  );
}

DestinationFilter.propTypes = {
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  selectedDestinations: PropTypes.arrayOf(PropTypes.string).isRequired,
  showAll: PropTypes.bool.isRequired,
  onShowAllChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Holiday Type Filter Component
 * Checkbox list of available holiday types (max 8 shown)
 */
function HolidayTypeFilter({
  holidayTypes,
  selectedHolidayTypes,
  onChange,
}) {
  const handleToggle = (label) => {
    onChange(
      selectedHolidayTypes.includes(label)
        ? selectedHolidayTypes.filter((item) => item !== label)
        : [...selectedHolidayTypes, label]
    );
  };

  return (
    <div className="py-3 sm:py-4">
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-bold text-[#1F1F1F] flex items-center gap-2">
        Holiday Types
      </p>
      <div className="space-y-1.5 sm:space-y-2">
        {holidayTypes.length > 0 ? (
          holidayTypes.slice(0, 8).map((holidayType) => (
            <label
              key={holidayType.slug}
              className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-[#666]"
            >
              <input
                type="checkbox"
                checked={selectedHolidayTypes.includes(holidayType.label)}
                onChange={() => handleToggle(holidayType.label)}
                className="h-3.5 sm:h-4 w-3.5 sm:w-4 rounded border-[#D5D5D5]"
              />
              <span>{holidayType.label}</span>
            </label>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-[#888]">
            No holiday types available
          </p>
        )}
      </div>
      {holidayTypes.length > 8 ? (
        <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold text-[#CB2187]">
          Show all ({holidayTypes.length})
        </p>
      ) : null}
    </div>
  );
}

HolidayTypeFilter.propTypes = {
  holidayTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedHolidayTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

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
