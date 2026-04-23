import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import FiltersSidebar from "./FiltersSidebar";
import ResultsHeader from "./ResultsHeader";
import DealCard from "./DealCard";
import {
  parsePrice,
  getUniqueRatings,
  normalizeSearchText,
} from "./utils";

/**
 * AllVacationDealsResultsSection Component
 * Main orchestrator for vacation deals display with filtering and sorting
 */
function AllVacationDealsResultsSection({
  deals,
  destinationFilters,
  holidayTypeFilters,
}) {
  // State Management
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState([]);
  const [sortBy, setSortBy] = useState("best-deals");
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  // Price Range State
  const priceValues = useMemo(
    () =>
      deals
        .map((deal) => parsePrice(deal.starting_price))
        .filter((value) => value !== null),
    [deals]
  );
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const effectiveMinPrice = minPrice;
  const effectiveMaxPrice = maxPrice;

  // Normalize price range to effective bounds
  const normalizedPriceRange = useMemo(() => {
    const currentMin = Math.min(priceRange[0], priceRange[1]);
    const currentMax = Math.max(priceRange[0], priceRange[1]);
    return [
      Math.max(effectiveMinPrice, currentMin),
      Math.min(effectiveMaxPrice, currentMax),
    ];
  }, [effectiveMaxPrice, effectiveMinPrice, priceRange]);

  // Rating options
  const ratingOptions = getUniqueRatings(deals);
  const hasDestinationFilters = destinationFilters.length > 0;

  // Filter deals based on all criteria
  const filteredDeals = useMemo(() => {
    if (!hasDestinationFilters) {
      return [];
    }

    const normalizedDestinations = selectedDestinations
      .map((value) => normalizeSearchText(value))
      .filter((value) => value.length > 0);
    const normalizedHolidayTypes = selectedHolidayTypes.map((value) =>
      value.toLowerCase()
    );
    const [selectedMinPrice, selectedMaxPrice] = normalizedPriceRange;

    const hasPriceFilter =
      selectedMinPrice > effectiveMinPrice ||
      selectedMaxPrice < effectiveMaxPrice;
    const hasAnyFilter =
      normalizedDestinations.length > 0 ||
      selectedRatings.length > 0 ||
      normalizedHolidayTypes.length > 0 ||
      hasPriceFilter;

    if (!hasAnyFilter) {
      return deals;
    }

    return deals.filter((deal) => {
      const dealRating = Number(deal.property_rating || 0);
      const roundedRating = Number.isFinite(dealRating)
        ? Math.min(5, Math.max(1, Math.round(dealRating)))
        : 0;
      const dealPrice = parsePrice(deal.starting_price);

      const title = (deal.name || deal.title || "").toLowerCase();
      const normalizedLocation = normalizeSearchText(deal.location || "");
      const description = (
        deal.intro_text ||
        deal.extras ||
        deal.info_paragraph ||
        ""
      ).toLowerCase();
      const searchableText = `${title} ${normalizedLocation} ${description}`;

      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.includes(roundedRating);

      const matchesDestination =
        normalizedDestinations.length === 0 ||
        normalizedDestinations.some((destination) =>
          (` ${normalizedLocation} `).includes(` ${destination} `)
        );

      const matchesHolidayType =
        normalizedHolidayTypes.length === 0 ||
        normalizedHolidayTypes.some((holidayType) =>
          searchableText.includes(holidayType)
        );

      const matchesPriceRange =
        dealPrice === null ||
        (dealPrice >= selectedMinPrice && dealPrice <= selectedMaxPrice);

      return (
        matchesRating &&
        matchesDestination &&
        matchesHolidayType &&
        matchesPriceRange
      );
    });
  }, [
    deals,
    effectiveMaxPrice,
    effectiveMinPrice,
    hasDestinationFilters,
    normalizedPriceRange,
    selectedDestinations,
    selectedHolidayTypes,
    selectedRatings,
  ]);

  // Sort deals based on selected option
  const sortedDeals = useMemo(() => {
    if (sortBy === "best-deals") {
      return filteredDeals;
    }

    const dealsToSort = [...filteredDeals];

    dealsToSort.sort((left, right) => {
      const leftPrice = parsePrice(left.starting_price);
      const rightPrice = parsePrice(right.starting_price);

      if (leftPrice === null && rightPrice === null) return 0;
      if (leftPrice === null) return 1;
      if (rightPrice === null) return -1;

      return sortBy === "price-low-to-high"
        ? leftPrice - rightPrice
        : rightPrice - leftPrice;
    });

    return dealsToSort;
  }, [filteredDeals, sortBy]);

  // Event Handlers
  const handleMinPriceChange = (event) => {
    const nextValue = Number(event.target.value);
    setPriceRange(([currentMin, currentMax]) => [
      Math.min(nextValue, currentMax),
      currentMax,
    ]);
  };

  const handleMaxPriceChange = (event) => {
    const nextValue = Number(event.target.value);
    setPriceRange(([currentMin, currentMax]) => [
      currentMin,
      Math.max(nextValue, currentMin),
    ]);
  };

  const clearAllFilters = () => {
    setSelectedRatings([]);
    setSelectedDestinations([]);
    setSelectedHolidayTypes([]);
    setPriceRange([effectiveMinPrice, effectiveMaxPrice]);
  };

  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 pb-8 sm:px-6 lg:px-10 lg:pb-16 pt-6 sm:pt-8 lg:pt-12">
      {/* Mobile Filters Toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h2 className="text-lg font-bold text-[#1F1F1F]">
          Filters & Results
        </h2>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-[#CB2187] bg-white px-4 py-2 text-sm font-semibold text-[#CB2187] hover:bg-[#FFF0F7] transition-colors"
        >
          {showFilters ? "Hide" : "Show"} Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <FiltersSidebar
          showFilters={showFilters}
          minPrice={effectiveMinPrice}
          maxPrice={effectiveMaxPrice}
          priceRange={normalizedPriceRange}
          onPriceMinChange={handleMinPriceChange}
          onPriceMaxChange={handleMaxPriceChange}
          ratingOptions={ratingOptions}
          selectedRatings={selectedRatings}
          onRatingChange={setSelectedRatings}
          destinations={destinationFilters}
          selectedDestinations={selectedDestinations}
          showAllDestinations={showAllDestinations}
          onShowAllDestinationsChange={setShowAllDestinations}
          onDestinationChange={setSelectedDestinations}
          holidayTypes={holidayTypeFilters}
          selectedHolidayTypes={selectedHolidayTypes}
          onHolidayTypeChange={setSelectedHolidayTypes}
          onClearAllFilters={clearAllFilters}
        />

        {/* Results Area */}
        <div className="min-h-0">
          {!hasDestinationFilters ? (
            // Empty State: No Destinations
            <div className="rounded-lg sm:rounded-2xl border-2 border-dashed border-[#E2B8CF] bg-gradient-to-br from-[#FFF8FB] to-[#FFF0F7] p-6 sm:p-12 text-center">
              <p className="text-base sm:text-lg font-semibold text-[#A11A6C] mb-2">
                No Destinations Available
              </p>
              <p className="text-xs sm:text-sm text-[#7C7C7C]">
                Please check back soon for more vacation deals!
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <ResultsHeader
                dealCount={filteredDeals.length}
                selectedDestinations={selectedDestinations}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Deals Grid */}
              <div className="space-y-4 rounded-2xl border border-[#E8E8E8] bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 sm:p-6">
                {sortedDeals.length > 0 ? (
                  sortedDeals.map((deal, index) => (
                    <DealCard key={`${deal.id}-${index}`} deal={deal} index={index} />
                  ))
                ) : (
                  // Empty State: No Matching Deals
                  <div className="rounded-lg sm:rounded-2xl border-2 border-dashed border-[#E2B8CF] bg-gradient-to-br from-[#FFF8FB] to-[#FFF0F7] p-6 sm:p-12 text-center">
                    <p className="text-base sm:text-lg font-semibold text-[#A11A6C] mb-2">
                      🔍 No Deals Match Your Filters
                    </p>
                    <p className="text-xs sm:text-sm text-[#7C7C7C]">
                      Try adjusting your search criteria to find perfect deals!
                    </p>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-4 rounded-full bg-[#CB2187] px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#A11A6C] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

AllVacationDealsResultsSection.propTypes = {
  deals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      slug: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      location: PropTypes.string,
      property_rating: PropTypes.string,
      card_image: PropTypes.string,
      offer_tag_type: PropTypes.string,
      offer_on_card: PropTypes.string,
      info_paragraph: PropTypes.string,
      intro_text: PropTypes.string,
      extras: PropTypes.string,
      starting_price: PropTypes.string,
      api_url: PropTypes.string,
    })
  ).isRequired,
  destinationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  holidayTypeFilters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AllVacationDealsResultsSection;
