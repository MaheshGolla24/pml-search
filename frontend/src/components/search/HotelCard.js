import { useMemo } from 'react';
import { ChevronRight, Moon, Plane, Sparkles, UtensilsCrossed } from 'lucide-react';
import { parseHotelStayInfo } from '../../lib/utils';

const STAR_PATH = "M14.0001 5.4091L8.91313 5.07466L6.99734 0.261719L5.08156 5.07466L0.0001297 5.4091L3.89754 8.7184L2.61862 13.7384L6.99734 10.9707L11.3761 13.7384L10.0972 8.7184L14.0001 5.4091Z";
const PLACEHOLDER_IMG = 'https://planmylux.s3.eu-west-2.amazonaws.com/placeholder.webp';

function PmlStars({ rating }) {
  const num = parseInt(rating) || 0;
  return (
    <span className="inline-flex items-center">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={`s${i}`} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-[1px]">
          <path d={STAR_PATH} fill={num >= i + 1 ? "#CB2187" : "#D3D3D3"} />
        </svg>
      ))}
    </span>
  );
}

function OfferBadge({ offerOnCard, saveUpToText }) {
  if (offerOnCard && offerOnCard.trim()) {
    return (
      <span className="absolute top-0 left-0 bg-white text-[#CB2187] pr-[32px] pl-[12px] pt-[4px] pb-[4px] text-[11px] md:text-[13px] font-semibold max-w-[70%] leading-[18px] tracking-[0.015em] rounded-br-[167px] pointer-events-none">
        {offerOnCard}
      </span>
    );
  }
  if (saveUpToText) {
    return (
      <span className="absolute top-0 left-0 bg-white text-[#CB2187] pr-[32px] pl-[12px] pt-[4px] pb-[4px] text-[11px] md:text-[13px] font-semibold max-w-[70%] leading-[18px] tracking-[0.015em] rounded-br-[167px] pointer-events-none uppercase">
        Save up to {saveUpToText}
      </span>
    );
  }
  return null;
}

function HotelImage({ imageUrl, altText, offerOnCard, saveUpToText, offerTagType }) {
  return (
    <div className="relative w-full sm:w-[300px] lg:w-[360px] h-[220px] sm:h-auto sm:min-h-[240px] flex-shrink-0 overflow-hidden bg-pml-bg-base">
      <img
        src={imageUrl}
        alt={altText}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 will-change-transform"
      />
      <OfferBadge offerOnCard={offerOnCard} saveUpToText={saveUpToText} />
      {offerTagType && offerTagType.startsWith('http') && (
        <img className="absolute top-5 right-2 pointer-events-none -rotate-[30deg] w-auto h-auto max-h-[84px] object-contain" src={offerTagType} alt="tag" />
      )}
    </div>
  );
}

function getDiscountPercent(saveUpToText) {
  const match = (saveUpToText || '').match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  const percent = Math.round(Number(match[1]));
  if (!percent || percent <= 0 || percent >= 95) return null;
  return percent;
}

function formatBoardBasisLabel(boardBasis) {
  if (!boardBasis) return '';
  if (boardBasis.toLowerCase() === 'bed and breakfast') return 'B&B';
  return boardBasis;
}

function HotelChips({ stayInfo, offerType }) {
  const offerLabel = offerType
    ? offerType.replace(/[_-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
    : '';

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {stayInfo.minDuration > 0 && (
        <div className="flex items-center gap-1.5 bg-[#f9f9fa] text-[#595858] px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold border border-gray-200/70">
          <Moon className="w-3.5 h-3.5 text-[#cb2187]/80" />
          {stayInfo.minDuration} {stayInfo.minDuration === 1 ? 'Night' : 'Nights'}
        </div>
      )}
      {stayInfo.boardBasis && (
        <div className="flex items-center gap-1.5 bg-[#f9f9fa] text-[#595858] px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold border border-gray-200/70">
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#cb2187]/80" />
          {formatBoardBasisLabel(stayInfo.boardBasis)}
        </div>
      )}
      <div className="flex items-center gap-1.5 bg-[#f9f9fa] text-[#595858] px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold border border-gray-200/70">
        <Plane className="w-3.5 h-3.5 text-[#cb2187]/80" />
        Flights Included
      </div>
      {/* {offerLabel && (
        <div className="flex items-center gap-1.5 bg-[#f6eaf2] text-[#cb2187] px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-bold border border-[#cb2187]/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          {offerLabel}
        </div>
      )} */}
    </div>
  );
}

function HotelPricing({ currentPrice, saveUpToText, headlineReview, href, slug }) {
  const discountPercent = getDiscountPercent(saveUpToText);
  const oldPrice = discountPercent
    ? Math.round(currentPrice / (1 - discountPercent / 100))
    : null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col">
        {currentPrice > 0 && (
          <div>
            <div className="text-[#808080] text-[13px] font-medium line-through decoration-[#808080]/50 mb-0.5 min-h-[18px] tracking-[0.01em]">
              {oldPrice && (
                <span>Regularly &pound;{oldPrice}</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-1.5 leading-[0.95]">
              <span className="text-[34px] md:text-[38px] font-bold text-[#CB2187] tracking-[-0.01em]">&pound;{currentPrice}</span>
              <span className="text-[#cb2187]/90 font-semibold text-[18px] md:text-[20px]">/</span>
              <span className="text-[#cb2187]/90 font-semibold text-[18px] md:text-[20px]">pp</span>
            </div>
            {discountPercent && (
              <div className="text-[#008a25] text-[10px] font-semibold bg-[#008a25]/10 px-2 py-1 rounded-md w-max border border-[#008a25]/20 tracking-[0.02em]">
                {discountPercent}% OFF applied
              </div>
            )}
          </div>
        )}
        {/* {headlineReview && (
          <p className="text-[11px] text-[#999] italic mt-1 line-clamp-1 max-w-[260px]">&ldquo;{headlineReview}&rdquo;</p>
        )} */}
      </div>
      <a
        href={href}
        data-testid={`view-deal-${slug}`}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full text-white text-[16px] font-semibold px-8 py-3 transition-all whitespace-nowrap no-underline btn-brand-gradient shadow-[0_4px_14px_rgba(203,33,135,0.3)] hover:translate-y-[-1px]"
      >
        View Deal
        <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function stripHtml(str) {
  return str ? str.replace(/<[^>]*>/g, '').substring(0, 180) : '';
}

export default function HotelCard({ hotel, innerRef }) {
  const imageUrl = hotel.card_image || hotel.thumbnail_1 || PLACEHOLDER_IMG;
  const currentPrice = hotel.starting_price > 0 ? Math.round(hotel.starting_price) : 0;
  const href = `/hotels/${hotel.slug}`;
  const stayInfo = useMemo(() => parseHotelStayInfo(hotel.api_url), [hotel.api_url]);
  const introClean = useMemo(() => stripHtml(hotel.intro_text), [hotel.intro_text]);

  return (
    <div
      ref={innerRef}
      data-testid={`hotel-card-${hotel.slug}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-[0_15px_50px_rgb(0,0,0,0.1)] shadow-[0_10px_40px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-[2px] font-['Montserrat']"
    >
      <div className="flex flex-col sm:flex-row">
        <HotelImage
          imageUrl={imageUrl}
          altText={hotel.hotel_name}
          offerOnCard={hotel.offer_on_card}
          saveUpToText={hotel.saveuptotext}
          offerTagType={hotel.offer_tag_type}
        />
        <div className="p-5 md:p-6 flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2.5 gap-3">
              <div className="text-[#808080] text-[11px] font-bold uppercase tracking-[0.15em] line-clamp-1">
                {hotel.location || ''}
              </div>
              <div className="flex items-center gap-1.5 text-[#cb2187] bg-[#f6eaf2] px-2.5 py-1 rounded-full border border-[#cb2187]/15 shadow-sm">
                <PmlStars rating={hotel.property_rating} />
              </div>
            </div>
            <h3 className="text-lg md:text-[20px] font-bold text-black leading-[1.25] mb-3 line-clamp-2" title={hotel.offer_header || hotel.hotel_name}>
            {hotel.offer_header || hotel.hotel_name}
            </h3>
            <HotelChips stayInfo={stayInfo} offerType={hotel.hotel_offer_type} />
            {/* {introClean && (
              <p className="text-[12px] text-[#666] leading-[1.5] mb-1 line-clamp-2">{introClean}</p>
            )} */}
          </div>
          <HotelPricing
            currentPrice={currentPrice}
            saveUpToText={hotel.saveuptotext}
            headlineReview={hotel.headline_review}
            href={href}
            slug={hotel.slug}
          />
        </div>
      </div>
    </div>
  );
}

export function HotelCardSkeleton() {
  return (
    <div data-testid="hotel-card-skeleton" className="bg-white rounded-[8px] border border-[#d3d3d3] overflow-hidden animate-pulse font-['Montserrat']">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[300px] lg:w-[360px] h-[220px] sm:h-[240px] bg-[#f0f0f0] flex-shrink-0" />
        <div className="flex-1 p-[16px] space-y-3">
          <div className="h-[14px] w-1/3 bg-[#eee] rounded" />
          <div className="h-[14px] w-24 bg-[#eee] rounded" />
          <div className="h-[18px] w-3/4 bg-[#eee] rounded" />
          <div className="h-[48px] w-full bg-[#f5f5f5] rounded-[8px]" />
          <div className="flex justify-between items-end mt-4">
            <div className="h-[28px] w-28 bg-[#eee] rounded" />
            <div className="h-[40px] w-[120px] bg-pml-bg-brand-tint rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
