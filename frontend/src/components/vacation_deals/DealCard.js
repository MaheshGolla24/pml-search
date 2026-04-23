import React from "react";
import PropTypes from "prop-types";
import { BedDouble, Moon, Plane, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getRatingLabel, getRoundedRating, getDealFeatureBadges } from "./utils";

/**
 * DealCard Component
 * Displays a single vacation deal with image, details, rating, and features
 */
function DealCard({ deal, index }) {
  const href = deal.slug ? `/hotels/${deal.slug}` : deal.api_url ?? "/offers";
  const title = deal.name || deal.title || "Holiday deal";
  const description = (
    deal.intro_text ||
    deal.extras ||
    deal.info_paragraph ||
    ""
  ).trim();
  const ratingLabel = getRatingLabel(deal);
  const roundedRating = getRoundedRating(deal);
  const featureBadges = getDealFeatureBadges(deal);
  const cardKey = `${deal.id}-${deal.slug ?? deal.api_url ?? title}-${index}`;

  const renderBadgeIcon = (badgeKey) => {
    switch (badgeKey) {
      case "nights":
        return <Moon size={12} strokeWidth={2.2} />;
      case "bed-breakfast":
        return <BedDouble size={12} strokeWidth={2.2} />;
      case "flights":
        return <Plane size={12} strokeWidth={2.2} />;
      case "all-inclusive":
        return <Sparkles size={12} strokeWidth={2.2} />;
      default:
        return null;
    }
  };

  return (
    <article
      key={cardKey}
      className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgba(203,33,135,0.12)] sm:hover:shadow-[0_12px_30px_rgba(203,33,135,0.15)] transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr]">
        {/* Image Section */}
        <div className="relative h-40 sm:h-48 md:h-full">
          <img
            src={deal.card_image || "/assets/images/hero-1.png"}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {deal.offer_on_card ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold tracking-wide text-[#CB2187]">
              {deal.offer_on_card}
            </span>
          ) : null}
          {deal.offer_tag_type ? (
            <img
              src={deal.offer_tag_type}
              alt="Offer tag"
              width={48}
              height={48}
              className="pointer-events-none absolute right-2 top-5 w-12 -rotate-[30deg]"
            />
          ) : null}
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between p-3 sm:p-4 md:p-5">
          <div>
            {/* Location & Rating */}
            <div className="mb-1.5 sm:mb-2 flex items-start justify-between gap-2 sm:gap-3">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#878787]">
                {deal.location || ""}
              </p>
              {roundedRating ? (
                <span
                  className="inline-flex items-center gap-0.5 rounded-full border border-[#D8D2D9] bg-[#F2EFF3] px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm leading-none flex-shrink-0"
                  aria-label={ratingLabel ?? undefined}
                  title={ratingLabel ?? undefined}
                >
                  <span className="text-[#CB2187]">
                    {"★".repeat(roundedRating)}
                  </span>
                  {roundedRating < 5 ? (
                    <span className="text-[#C4BDC6]">
                      {"★".repeat(5 - roundedRating)}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold leading-tight text-[#1F1F1F]">
              {title}
            </h3>

            {/* Description */}
            {description ? (
              <p className="mt-2 sm:mt-3 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#666]">
                {description}
              </p>
            ) : null}

            {/* Feature Badges */}
            {featureBadges.length > 0 ? (
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                {featureBadges.map((badge) => (
                  <span
                    key={`${cardKey}-${badge.key}`}
                    className={
                      badge.highlight
                        ? "inline-flex items-center gap-0.5 rounded border border-[#F6A7D2] bg-[#FDECF6] px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-[#CB2187]"
                        : "inline-flex items-center gap-0.5 rounded border border-[#D8D8DD] bg-[#F6F6F8] px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-[#5D5D64]"
                    }
                  >
                    {renderBadgeIcon(badge.key)}
                    <span>{badge.label}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* View Deal Button */}
          <div className="mt-3 sm:mt-5 flex justify-end">
            <Link
              to={href}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-[#CB2187] to-[#A11A6C] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              View Deal
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

DealCard.propTypes = {
  deal: PropTypes.shape({
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
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default DealCard;
