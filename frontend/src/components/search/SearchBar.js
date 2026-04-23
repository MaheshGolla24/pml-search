import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Palmtree, ChevronDown } from 'lucide-react';
import { useFilterOptions } from '@/hooks/useSearch';
import { SEARCH_PREFILL_KEY } from '@/hooks/useSearchFilters';

const DEAL_TYPES = [
  { value: '', label: 'All Deal Types' },
  { value: 'all-inclusive', label: 'All Inclusive' },
  { value: 'beach-holidays', label: 'Beach Holidays' },
  { value: 'city-breaks', label: 'City Breaks' },
];

function SearchDropdown({ testId, icon: Icon, label, placeholder, value, options, onChange, open, onToggle, onClose }) {
  const ref = useRef(null);
  const selectedLabel = useMemo(
    () => options.find(o => o.value === value)?.label || placeholder,
    [options, value, placeholder]
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0" data-testid={testId}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-[8px] bg-transparent border-none rounded-[12px] cursor-pointer text-left transition-colors"
      >
        <Icon className="w-[18px] h-[18px] text-[#cb2187] flex-shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-[0.09em] text-[#8f8790] leading-[1.1] font-bold">{label}</span>
          <span className={`block text-[14px] truncate mt-[2px] ${value ? 'text-[#2f2f2f] font-bold' : 'text-[#666] font-semibold'}`}>
            {selectedLabel}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-[#968a93] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] shadow-[0_10px_28px_rgba(30,12,26,0.16)] border border-[#ececec] py-1 z-50 max-h-[280px] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              data-testid={`${testId}-opt-${opt.value || 'all'}`}
              onClick={() => { onChange(opt.value); onClose(); }}
              className={`w-full text-left px-4 py-[8px] text-[14px] border-none cursor-pointer transition-colors ${
                opt.value === value
                  ? 'bg-pml-bg-brand-tint text-pml-brand font-medium'
                  : 'bg-transparent text-pml-text-700 hover:bg-pml-bg-brand-tint hover:text-pml-brand'
              }`}
            >
              {opt.label}
              {opt.count != null && <span className="ml-1 text-[12px] text-pml-text-500">({opt.count})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar({ initialQuery = '', initialDest = '', initialDealType = '', compact = false }) {
  const navigate = useNavigate();
  const { options } = useFilterOptions();
  const [dest, setDest] = useState(initialDest);
  const [dealType, setDealType] = useState(initialDealType);
  const [openDropdown, setOpenDropdown] = useState(null);

  const destinationOptions = useMemo(() => {
    const base = [{ value: '', label: 'All Destinations' }];
    if (options?.destinations) {
      return [...base, ...options.destinations.map(d => ({ value: d.value, label: d.label, count: d.count }))];
    }
    return base;
  }, [options]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const prefill = {
      q: initialQuery || '',
      destinations: dest ? [dest] : [],
      holiday_types: dealType ? [dealType] : [],
      rating: [],
      price_min: null,
      price_max: null,
      sort: 'best',
    };

    sessionStorage.setItem(SEARCH_PREFILL_KEY, JSON.stringify(prefill));
    navigate('/search');
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} data-testid="search-bar-compact" className="w-full">
        <div className="bg-white/95 backdrop-blur-md border border-white/60 rounded-[22px] md:rounded-full p-[8px] shadow-[0_14px_35px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-[8px] items-center">
            <div className="bg-white rounded-[14px] md:rounded-l-full md:rounded-r-none border border-[#eee] md:border-r md:border-l-0 md:border-y-0 md:shadow-none shadow-sm">
            <SearchDropdown
              testId="search-dest-compact"
              icon={MapPin}
              label="Destination"
              placeholder="All Destinations"
              value={dest}
              options={destinationOptions}
              onChange={setDest}
              open={openDropdown === 'dest'}
              onToggle={() => setOpenDropdown(openDropdown === 'dest' ? null : 'dest')}
              onClose={() => setOpenDropdown(null)}
            />
            </div>
            <div className="bg-white rounded-[14px] md:rounded-none border border-[#eee] md:border-y-0 md:border-r md:border-l-0 md:shadow-none shadow-sm">
            <SearchDropdown
              testId="search-dealtype-compact"
              icon={Palmtree}
              label="Deal Type"
              placeholder="All Deal Types"
              value={dealType}
              options={DEAL_TYPES}
              onChange={setDealType}
              open={openDropdown === 'deal'}
              onToggle={() => setOpenDropdown(openDropdown === 'deal' ? null : 'deal')}
              onClose={() => setOpenDropdown(null)}
            />
            </div>
          <button
            data-testid="search-submit-compact"
            type="submit"
            className="flex items-center justify-center gap-2 px-7 text-white text-[16px] font-bold border-none cursor-pointer whitespace-nowrap btn-brand-gradient rounded-[14px] md:rounded-full min-h-[50px] shadow-[0_4px_14px_rgba(203,33,135,0.30)]"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="search-bar-hero" className="w-full">
      <div className="bg-white/95 backdrop-blur-md border border-white/60 rounded-[24px] md:rounded-full p-[8px] shadow-[0_14px_35px_rgba(0,0,0,0.16)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-[8px] items-stretch">
          <div className="bg-white rounded-[14px] md:rounded-l-full md:rounded-r-none border border-[#eee] md:border-r md:border-l-0 md:border-y-0 md:shadow-none shadow-sm">
          <SearchDropdown
            testId="search-dest-hero"
            icon={MapPin}
            label="Destination"
            placeholder="All Destinations"
            value={dest}
            options={destinationOptions}
            onChange={setDest}
            open={openDropdown === 'dest'}
            onToggle={() => setOpenDropdown(openDropdown === 'dest' ? null : 'dest')}
            onClose={() => setOpenDropdown(null)}
          />
          </div>
          <div className="bg-white rounded-[14px] md:rounded-none border border-[#eee] md:border-y-0 md:border-r md:border-l-0 md:shadow-none shadow-sm">
          <SearchDropdown
            testId="search-dealtype-hero"
            icon={Palmtree}
            label="Deal Type"
            placeholder="All Deal Types"
            value={dealType}
            options={DEAL_TYPES}
            onChange={setDealType}
            open={openDropdown === 'deal'}
            onToggle={() => setOpenDropdown(openDropdown === 'deal' ? null : 'deal')}
            onClose={() => setOpenDropdown(null)}
          />
          </div>
          <button
            data-testid="search-submit-hero"
            type="submit"
            className="flex items-center justify-center gap-2 text-white text-[18px] font-bold rounded-[14px] md:rounded-full px-8 py-[10px] border-none cursor-pointer transition-opacity hover:opacity-90 whitespace-nowrap btn-brand-gradient min-h-[50px] shadow-[0_4px_15px_rgba(203,33,135,0.30)]"
          >
            <span>Search</span>
            <Search className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </form>
  );
}
