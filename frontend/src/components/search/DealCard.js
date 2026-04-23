import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { parseHotelStayInfo } from '../../lib/utils';

const STAR_PATH = "M14.0001 5.4091L8.91313 5.07466L6.99734 0.261719L5.08156 5.07466L0.0001297 5.4091L3.89754 8.7184L2.61862 13.7384L6.99734 10.9707L11.3761 13.7384L10.0972 8.7184L14.0001 5.4091Z";

function PmlStars({ rating }) {
  const num = parseInt(rating) || 0;
  return (
    <span className="inline-flex items-center">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={`ds${i}`} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-[1px]">
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

function getDiscountPercent(saveUpToText) {
  const match = (saveUpToText || '').match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  const percent = Math.round(Number(match[1]));
  if (!percent || percent <= 0 || percent >= 95) return null;
  return percent;
}

function DetailedPrice({ currentPrice, saveUpToText }) {
  if (!currentPrice || currentPrice <= 0) return null;

  const discountPercent = getDiscountPercent(saveUpToText);
  const oldPrice = discountPercent
    ? Math.round(currentPrice / (1 - discountPercent / 100))
    : null;

  return (
    <div>
      <div className="flex items-center gap-2 min-h-[20px]">
        {discountPercent && (
          <span className="inline-flex items-center rounded-[4px] bg-[#22B35A] px-2 py-[2px] text-[11px] font-semibold text-white">
            Save {discountPercent}%
          </span>
        )}
        {oldPrice && (
          <span className="text-[16px] font-semibold text-[#666] line-through">&pound;{oldPrice}</span>
        )}
      </div>
      <div className="flex items-end leading-none mt-[2px]">
        <span className="text-[30px] md:text-[36px] font-extrabold text-[#CB2187]">&pound;{currentPrice}</span>
        <span className="text-[24px] md:text-[30px] font-bold text-[#CB2187]">/</span>
        <span className="text-[24px] md:text-[30px] font-semibold text-[#CB2187]">pp</span>
      </div>
    </div>
  );
}

export default function DealCard({ hotel }) {
  const img = hotel.card_image || hotel.thumbnail_1 || 'https://planmylux.s3.eu-west-2.amazonaws.com/placeholder.webp';
  const href = `/hotels/${hotel.slug}`;
  const currentPrice = hotel.starting_price > 0 ? Math.round(hotel.starting_price) : 0;
  const stayInfo = useMemo(() => parseHotelStayInfo(hotel.api_url), [hotel.api_url]);
  const introClean = useMemo(
    () => hotel.intro_text ? hotel.intro_text.replace(/<[^>]*>/g, '').substring(0, 120) : '',
    [hotel.intro_text]
  );

  return (
    <a href={href} className="block group no-underline">
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col h-full border border-[#d3d3d3]">
        <div className="relative w-full overflow-hidden bg-pml-bg-base h-[225px]">
          <img src={img} alt={hotel.hotel_name} loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 will-change-transform" />
          <OfferBadge offerOnCard={hotel.offer_on_card} saveUpToText={hotel.saveuptotext} />
          {hotel.offer_tag_type && hotel.offer_tag_type.startsWith('http') && (
            <img className="absolute top-5 right-2 pointer-events-none -rotate-[30deg] w-auto h-auto max-h-[84px] object-contain" src={hotel.offer_tag_type} alt="tag" />
          )}
        </div>
        <div className="pt-[6px] pr-[8px] pb-[14px] pl-[8px] flex-grow flex flex-col justify-start items-start text-left bg-white">
          <div className="text-[14px] font-semibold text-pml-text-700 leading-[1.4] p-[4px] w-full line-clamp-1 min-h-[28px]">{hotel.location || ""}</div>
          <div className="flex items-center justify-start p-[4px] min-h-[28px]"><PmlStars rating={hotel.property_rating} /></div>
          <h5 className="text-[14px] md:text-[16px] font-semibold text-pml-brand leading-[24px] mb-[4px] p-[4px] w-full min-h-[32px] truncate">{hotel.offer_header || hotel.hotel_name}</h5>
          {(stayInfo.minDuration || stayInfo.boardBasis) && (
            <div className="flex items-center gap-2 text-[12px] p-[4px] text-pml-text-600 min-h-[24px] mb-[6px]">
              {stayInfo.minDuration && <span className="font-semibold">{stayInfo.minDuration} Nights</span>}
              {stayInfo.minDuration && stayInfo.boardBasis && <span className="text-[#B5B5B5]">•</span>}
              {stayInfo.boardBasis && <span>{stayInfo.boardBasis}</span>}
            </div>
          )}
          {introClean && (
            <div className="rounded-[8px] text-[12px] text-pml-text-700 font-medium mb-[9px] w-full min-h-[48px] flex items-center justify-center text-center bg-pml-bg-alt border border-[#dfdede] px-[6px] md:px-[12px] py-[6px]">
              <span className="line-clamp-2 leading-[18px] tracking-[0.02em]">{introClean}</span>
            </div>
          )}
          <div className="w-full p-[4px] mt-auto">
            <DetailedPrice currentPrice={currentPrice} saveUpToText={hotel.saveuptotext} />
            <span className="w-full mt-2 flex items-center justify-center gap-2 rounded-[8px] text-white text-[14px] font-semibold py-[10px] transition-all hover:opacity-90 no-underline btn-brand-gradient">
              View Deal
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
