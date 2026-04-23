import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '@/components/search/FilterSidebar';

export default function MobileFilterPanel({ options, filters, total, onFilterChange, onClearAll }) {
  const [open, setOpen] = useState(false);
  const activeCount =
    (filters.destinations?.length || 0) +
    (filters.holiday_types?.length || 0) +
    (filters.rating?.length || 0) +
    ((filters.price_min != null || filters.price_max != null) ? 1 : 0);

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          data-testid="mobile-filter-toggle"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-white border border-[#e9e5ea] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#353535] shadow-[0_5px_16px_rgba(0,0,0,0.06)] w-full justify-center cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-[#CB2187] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeCount}</span>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" style={{ isolation: 'isolate' }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[92%] max-w-[360px] bg-[#fafafa] shadow-2xl overflow-y-auto z-[60]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between px-5 py-4 border-b">
              <span className="font-bold text-lg text-[#4c4c4c]">Filters</span>
              <button data-testid="close-mobile-filters" onClick={() => setOpen(false)} className="p-2 cursor-pointer bg-transparent border-none rounded-[8px] hover:bg-[#f5f5f5]">
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>
            <div className="relative" style={{ zIndex: 10 }}>
              <FilterSidebar
                options={options}
                filters={filters}
                onFilterChange={onFilterChange}
                onClearAll={() => { onClearAll(); setOpen(false); }}
                showHeader={false}
                mobile
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 z-20">
              <button
                data-testid="apply-mobile-filters"
                onClick={() => setOpen(false)}
                className="w-full text-white font-semibold py-3.5 rounded-xl cursor-pointer border-none"
                style={{ background: 'linear-gradient(110deg, #cb2187 0%, #cb2187 45%, #ecaed3 100%)' }}
              >
                Show {total} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
