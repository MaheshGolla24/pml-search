import { useFilterOptions, useSearch } from '@/hooks/useSearch';
import { useDebounce, useInfiniteScroll } from '@/hooks/useDebounce';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import FilterSidebar from '@/components/search/FilterSidebar';
import ActiveFilters from '@/components/search/ActiveFilters';
import SortSelect from '@/components/search/SortSelect';
import SearchBar from '@/components/search/SearchBar';
import MobileFilterPanel from '@/components/search/MobileFilterPanel';
import HotelResultsList from '@/components/search/HotelResultsList';

function BreadcrumbBar() {
  return (
    <section className="w-full bg-white border-b border-[#e8e8e8]">
      <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[10px] md:py-[12px]">
        <div className="w-full max-w-[1280px] mx-auto">
          <nav className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#7a7a7a]">
            <a href="/" className="hover:text-[#CB2187] transition-colors no-underline text-[#7a7a7a]">Home</a>
            <span>&gt;</span>
            <span className="text-[#4c4c4c] font-semibold">All Vacation Deals</span>
          </nav>
        </div>
      </div>
    </section>
  );
}

function ResultsHeader({ total, loading, sortValue, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <h2 className="text-[18px] md:text-h7 font-semibold text-pml-text-700">
        {loading ? 'Searching...' : `${total} Deal${total !== 1 ? 's' : ''} Found`}
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-[14px] text-pml-text-500">Sort by:</span>
        <SortSelect value={sortValue} onChange={onSortChange} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { filters, updateFilters, clearAll, removeFilter } = useSearchFilters();
  const debouncedFilters = useDebounce(filters, 300);
  const { options } = useFilterOptions();
  const { hotels, total, loading, loadingMore, hasMore, loadMore } = useSearch(debouncedFilters);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loadingMore);

  const handleSortChange = (v) => updateFilters({ ...filters, sort: v });

  return (
    <div data-testid="search-page" className="min-h-screen bg-pml-bg-base font-['Montserrat']">
      <BreadcrumbBar />

      <section className="sticky top-16 lg:top-20 z-40 w-full bg-pml-bg-alt/95 backdrop-blur-md border-b border-[#d5d5d5]">
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[10px] md:py-[14px]">
          <div className="w-full max-w-[1280px] mx-auto">
            <SearchBar initialQuery={filters.q} compact />
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[14px] md:py-[18px]">
        <div className="w-full max-w-[1280px] mx-auto">
          <MobileFilterPanel
            options={options}
            filters={filters}
            total={total}
            onFilterChange={updateFilters}
            onClearAll={clearAll}
          />

          <div className="flex gap-4 xl:gap-6 items-start xl:items-stretch min-h-0">
            <div className="hidden xl:block w-[290px] flex-shrink-0 h-[calc(100vh-190px)] overflow-y-auto pr-1 scrollbar-hide">
              <FilterSidebar options={options} filters={filters} onFilterChange={updateFilters} onClearAll={clearAll} />
            </div>

            <div className="flex-1 min-w-0 h-[calc(100vh-190px)] overflow-y-auto pr-1 scrollbar-hide">
              <ResultsHeader total={total} loading={loading} sortValue={filters.sort} onSortChange={handleSortChange} />

              <div className="mb-4">
                <ActiveFilters filters={filters} options={options} onRemove={removeFilter} onClearAll={clearAll} />
              </div>

              <HotelResultsList
                hotels={hotels}
                total={total}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                onClearAll={clearAll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
