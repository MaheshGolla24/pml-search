import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import * as Slider from '@radix-ui/react-slider';

// ── Shared star SVG path ──
const STAR_PATH = "M14.0001 5.4091L8.91313 5.07466L6.99734 0.261719L5.08156 5.07466L0.0001297 5.4091L3.89754 8.7184L2.61862 13.7384L6.99734 10.9707L11.3761 13.7384L10.0972 8.7184L14.0001 5.4091Z";

// ── FilterSection (collapsible) ──
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
      <button
        data-testid={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left cursor-pointer bg-transparent border-none p-0"
      >
        <span className="font-bold text-[14px] text-[#27272a] tracking-[0.01em]">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#666]" /> : <ChevronDown className="w-4 h-4 text-[#666]" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ── CheckboxItem ──
function CheckboxItem({ label, count, checked, onChange, testId }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); }
  }, [onChange]);

  return (
    <div
      data-testid={testId}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className="flex items-center gap-[10px] py-[6px] cursor-pointer group select-none"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? 'bg-[#CB2187] border-[#CB2187]' : 'border-[#d5d5d5] group-hover:border-[#CB2187]'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[14px] text-[#4c4c4c] flex-1 font-normal">{label}</span>
      {count != null && <span className="text-[12px] text-[#999] tabular-nums">{count}</span>}
    </div>
  );
}

// ── RatingCheckbox (single row for a rating value) ──
function RatingCheckbox({ ratingValue, checked, onToggle }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); }
  }, [onToggle]);

  const stars = useMemo(() => {
    const n = parseInt(ratingValue) || 0;
    return [0, 1, 2, 3, 4].map(i => (
      <svg key={`star-${ratingValue}-${i}`} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-[1px]">
        <path d={STAR_PATH} fill={n >= i + 1 ? "#CB2187" : "#E0E0E0"} />
      </svg>
    ));
  }, [ratingValue]);

  return (
    <div
      data-testid={`filter-rating-${ratingValue}`}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="flex items-center gap-[10px] py-[6px] cursor-pointer group select-none"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? 'bg-[#CB2187] border-[#CB2187]' : 'border-[#d5d5d5] group-hover:border-[#CB2187]'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="inline-flex items-center">{stars}</span>
      <span className="text-[14px] text-[#4c4c4c]">{ratingValue} Stars</span>
    </div>
  );
}

// ── PriceSlider ──
function PriceSlider({ priceMin, priceMax, filterMin, filterMax, onChange }) {
  const sliderValue = useMemo(
    () => [filterMin ?? priceMin, filterMax ?? priceMax],
    [filterMin, filterMax, priceMin, priceMax]
  );
  const floorMin = Math.floor(priceMin);
  const ceilMax = Math.ceil(priceMax);

  return (
    <div className="px-1">
      <Slider.Root
        data-testid="price-range-slider"
        className="relative flex items-center select-none touch-none w-full h-5"
        value={sliderValue}
        min={floorMin}
        max={ceilMax}
        step={10}
        onValueChange={([min, max]) => onChange(min, max)}
      >
        <Slider.Track className="bg-[#EDEDED] relative grow rounded-full h-[6px]">
          <Slider.Range className="absolute bg-[#CB2187] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-[20px] h-[20px] bg-white border-[3px] border-[#CB2187] rounded-full shadow-sm hover:shadow-md focus:outline-none transition-shadow cursor-grab" />
        <Slider.Thumb className="block w-[20px] h-[20px] bg-white border-[3px] border-[#CB2187] rounded-full shadow-sm hover:shadow-md focus:outline-none transition-shadow cursor-grab" />
      </Slider.Root>
      <div className="flex justify-between mt-[8px] text-[12px] text-[#666] font-semibold tabular-nums">
        <span>&pound;{sliderValue[0]}</span>
        <span>&pound;{sliderValue[1]}</span>
      </div>
    </div>
  );
}

// ── CheckboxGroup ──
function CheckboxGroup({ items, selectedValues, onToggle, testIdPrefix, maxVisible = null }) {
  const [showAll, setShowAll] = useState(false);
  const visible = maxVisible && !showAll ? items.slice(0, maxVisible) : items;

  return (
    <div className="space-y-0">
      {visible.map(item => (
        <CheckboxItem
          key={item.value}
          testId={`${testIdPrefix}-${item.value}`}
          label={item.label}
          count={item.count}
          checked={selectedValues?.includes(item.value) || false}
          onChange={() => onToggle(item.value)}
        />
      ))}
      {maxVisible && items.length > maxVisible && (
        <button
          data-testid={`${testIdPrefix}-show-all`}
          onClick={() => setShowAll(!showAll)}
          className="text-[#CB2187] text-[12px] font-medium mt-[4px] hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          {showAll ? 'Show less' : `Show all (${items.length})`}
        </button>
      )}
    </div>
  );
}

// ── Main FilterSidebar ──
export default function FilterSidebar({ options, filters, onFilterChange, onClearAll, showHeader = true, mobile = false }) {
  const filteredRatings = useMemo(
    () => options ? options.ratings.filter(r => r !== '55') : [],
    [options]
  );

  const activeCount = useMemo(() => (
    (filters.destinations?.length || 0) +
    (filters.holiday_types?.length || 0) +
    (filters.rating?.length || 0) +
    ((filters.price_min != null || filters.price_max != null) ? 1 : 0)
  ), [filters]);

  const toggleArray = useCallback((key, value) => {
    const arr = filters[key] || [];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onFilterChange({ ...filters, [key]: next });
  }, [filters, onFilterChange]);

  const handlePriceChange = useCallback((min, max) => {
    onFilterChange({ ...filters, price_min: min, price_max: max });
  }, [filters, onFilterChange]);

  if (!options) return null;

  return (
    <div data-testid="filter-sidebar" className={`font-['Montserrat'] ${mobile ? 'px-4 pb-4' : ''}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[22px] text-[#111]">Filters</span>
            {activeCount > 0 && (
              <span className="bg-[#CB2187] text-white text-[11px] font-bold rounded-full min-w-[22px] h-[22px] px-[6px] flex items-center justify-center">{activeCount}</span>
            )}
          </div>
          {activeCount > 0 && (
            <button data-testid="clear-all-filters" onClick={onClearAll} className="text-[#CB2187] text-[12px] font-bold hover:underline cursor-pointer bg-transparent border-none">
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        <FilterSection title="Price Range">
          <PriceSlider
            priceMin={options.price_min}
            priceMax={options.price_max}
            filterMin={filters.price_min}
            filterMax={filters.price_max}
            onChange={handlePriceChange}
          />
        </FilterSection>

        <FilterSection title="Rating">
          <div className="space-y-0">
            {filteredRatings.map(r => (
              <RatingCheckbox
                key={r}
                ratingValue={r}
                checked={filters.rating?.includes(r) || false}
                onToggle={() => toggleArray('rating', r)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Destinations">
          <CheckboxGroup
            items={options.destinations}
            selectedValues={filters.destinations}
            onToggle={(v) => toggleArray('destinations', v)}
            testIdPrefix="filter-dest"
            maxVisible={8}
          />
        </FilterSection>

        <FilterSection title="Holiday Types">
          <CheckboxGroup
            items={options.holiday_types}
            selectedValues={filters.holiday_types}
            onToggle={(v) => toggleArray('holiday_types', v)}
            testIdPrefix="filter-ht"
          />
        </FilterSection>
      </div>
    </div>
  );
}
