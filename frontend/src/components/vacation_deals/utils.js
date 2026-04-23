/**
 * Utility functions for vacation deals component
 */

/**
 * Get a human-readable rating label
 * @param {Object} deal - Deal object
 * @param {string} deal.property_rating - Rating value as string
 * @returns {string|null} Rating label (e.g., "4 Stars") or null
 */
export function getRatingLabel(deal) {
  const rating = Number(deal.property_rating || 0);
  if (!Number.isFinite(rating) || rating <= 0) return null;

  const rounded = Math.min(5, Math.max(1, Math.round(rating)));
  return `${rounded} Star${rounded === 1 ? "" : "s"}`;
}

/**
 * Get rounded rating (1-5 scale)
 * @param {Object} deal - Deal object
 * @param {string} deal.property_rating - Rating value as string
 * @returns {number|null} Rounded rating or null
 */
export function getRoundedRating(deal) {
  const rating = Number(deal.property_rating || 0);
  if (!Number.isFinite(rating) || rating <= 0) return null;

  return Math.min(5, Math.max(1, Math.round(rating)));
}

/**
 * Extract unique ratings from deals array
 * @param {Array} deals - Array of deal objects
 * @returns {Array<number>} Sorted unique ratings (descending)
 */
export function getUniqueRatings(deals) {
  const ratings = deals
    .map((deal) => Number(deal.property_rating || 0))
    .filter((rating) => Number.isFinite(rating) && rating > 0)
    .map((rating) => Math.min(5, Math.max(1, Math.round(rating))));

  return Array.from(new Set(ratings)).sort((left, right) => right - left);
}

/**
 * Extract feature badges from deal content
 * Detects: nights, bed & breakfast, flights, all-inclusive
 * @param {Object} deal - Deal object
 * @returns {Array} Array of badge objects with key, label, and optional highlight
 */
export function getDealFeatureBadges(deal) {
  const searchableText = [
    deal.offer_on_card,
    deal.extras,
    deal.info_paragraph,
    deal.intro_text,
    deal.title,
    deal.name,
  ]
    .filter(Boolean)
    .join(" ");

  const badges = [];
  const nightsMatch = searchableText.match(/(\d+)\s*(night|nights)\b/i);

  if (nightsMatch) {
    badges.push({
      key: "nights",
      label: `${nightsMatch[1]} Nights`,
    });
  }

  if (/(bed\s*&\s*breakfast|bed\s+and\s+breakfast|\bb&b\b)/i.test(searchableText)) {
    badges.push({
      key: "bed-breakfast",
      label: "Bed & Breakfast",
    });
  }

  if (/(flights?\s+included|including\s+flights?|with\s+flights?|return\s+flights?)/i.test(searchableText)) {
    badges.push({
      key: "flights",
      label: "Flights",
    });
  }

  if (/all[\s-]*inclusive/i.test(searchableText)) {
    badges.push({
      key: "all-inclusive",
      label: "All Inclusive",
      highlight: true,
    });
  }

  return badges;
}

/**
 * Parse price string to number
 * @param {string} value - Price string (e.g., "£499.99", "$1,200")
 * @returns {number|null} Parsed price or null if invalid
 */
export function parsePrice(value) {
  if (!value) return null;
  const parsed = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Format price for display (en-GB locale)
 * @param {number} value - Price value
 * @returns {string} Formatted price (e.g., "499.99" or "1,200")
 */
export function formatPrice(value) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Normalize text for searching/filtering
 * Converts to lowercase and removes special characters
 * @param {string} value - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
