import { Search } from 'lucide-react';
import HotelCard, { HotelCardSkeleton } from '@/components/search/HotelCard';

function SkeletonList() {
  return (
    <>
      <HotelCardSkeleton key="sk-0" />
      <HotelCardSkeleton key="sk-1" />
      <HotelCardSkeleton key="sk-2" />
      <HotelCardSkeleton key="sk-3" />
    </>
  );
}

function LoadMoreSkeletons() {
  return (
    <div className="space-y-4">
      <HotelCardSkeleton key="lm-0" />
      <HotelCardSkeleton key="lm-1" />
    </div>
  );
}

function NoResults({ onClearAll }) {
  return (
    <div data-testid="no-results" className="text-center py-16 bg-white rounded-[8px] border border-[#ececec]">
      <Search className="w-12 h-12 text-[#d5d5d5] mx-auto mb-4" />
      <h3 className="text-[18px] font-semibold text-[#4c4c4c] mb-2">No deals found</h3>
      <p className="text-[14px] text-[#666] mb-4">Try adjusting your filters or search terms</p>
      <button onClick={onClearAll} className="text-[#CB2187] font-semibold text-[14px] hover:underline cursor-pointer bg-transparent border-none">
        Clear all filters
      </button>
    </div>
  );
}

function AllSeen({ total }) {
  return <p className="text-center text-[14px] text-[#999] py-6">You&apos;ve seen all {total} deals</p>;
}

export default function HotelResultsList({ hotels, total, loading, loadingMore, hasMore, sentinelRef, onClearAll }) {
  if (loading) {
    return (
      <div className="space-y-4" data-testid="results-loading">
        <SkeletonList />
      </div>
    );
  }

  if (hotels.length === 0) {
    return <NoResults onClearAll={onClearAll} />;
  }

  return (
    <div className="space-y-4" data-testid="results-list">
      {hotels.map((hotel, idx) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          innerRef={idx === hotels.length - 1 ? sentinelRef : null}
        />
      ))}
      {loadingMore && <LoadMoreSkeletons />}
      {!hasMore && hotels.length > 0 && <AllSeen total={total} />}
    </div>
  );
}
