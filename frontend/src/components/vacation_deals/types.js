/**
 * Type definitions for vacation deals components
 * These are JSDoc type definitions for documentation and IDE support
 */

/**
 * @typedef {Object} DealItem
 * @property {number} id - Unique identifier
 * @property {string} [slug] - URL slug for the deal
 * @property {string} [name] - Deal name
 * @property {string} [title] - Deal title
 * @property {string} [location] - Deal location
 * @property {string} [property_rating] - Property rating (1-5)
 * @property {string} [card_image] - Image URL for card display
 * @property {string} [offer_tag_type] - URL to offer tag image
 * @property {string} [info_paragraph] - Additional info paragraph
 * @property {string} [intro_text] - Introductory text
 * @property {string} [extras] - Extra features text
 * @property {string} [starting_price] - Starting price string (e.g., "£499.99")
 * @property {string} [api_url] - Fallback API URL
 * @property {string} [offer_on_card] - Offer text displayed on card
 */

/**
 * @typedef {Object} DestinationFilterItem
 * @property {string} href - Link for the destination
 * @property {string} label - Display label for the destination
 * @property {number} [count] - Number of deals available at destination
 */

/**
 * @typedef {Object} HolidayTypeFilterItem
 * @property {string} label - Display label for holiday type
 * @property {string} slug - URL slug for holiday type
 */

/**
 * @typedef {Object} DealFeatureBadge
 * @property {"nights"|"bed-breakfast"|"flights"|"all-inclusive"} key - Badge type key
 * @property {string} label - Display label for badge
 * @property {boolean} [highlight] - Whether this badge should be highlighted
 */

/**
 * @typedef {"best-deals"|"price-low-to-high"|"price-high-to-low"} SortOption
 */

/**
 * @typedef {Object} AllVacationDealsResultsSectionProps
 * @property {DealItem[]} deals - Array of vacation deals
 * @property {DestinationFilterItem[]} destinationFilters - Array of destination filter options
 * @property {HolidayTypeFilterItem[]} holidayTypeFilters - Array of holiday type filter options
 */

export {};
