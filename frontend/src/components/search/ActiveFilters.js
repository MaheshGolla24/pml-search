import { X } from 'lucide-react';

export default function ActiveFilters({ filters, options, onRemove, onClearAll }) {
  const tags = [];

  if (filters.destinations?.length && options?.destinations) {
    filters.destinations.forEach(d => {
      const opt = options.destinations.find(o => o.value === d);
      tags.push({ key: 'destinations', value: d, label: opt?.label || d });
    });
  }

  if (filters.holiday_types?.length && options?.holiday_types) {
    filters.holiday_types.forEach(h => {
      const opt = options.holiday_types.find(o => o.value === h);
      tags.push({ key: 'holiday_types', value: h, label: opt?.label || h });
    });
  }

  if (filters.rating?.length) {
    filters.rating.forEach(r => {
      tags.push({ key: 'rating', value: r, label: `${r} Star` });
    });
  }

  if (filters.price_min != null || filters.price_max != null) {
    const min = filters.price_min ?? Math.floor(options?.price_min || 0);
    const max = filters.price_max ?? Math.ceil(options?.price_max || 10000);
    tags.push({ key: 'price', value: 'price', label: `£${min} - £${max}` });
  }

  if (filters.q) {
    tags.push({ key: 'q', value: filters.q, label: `"${filters.q}"` });
  }

  if (!tags.length) return null;

  return (
    <div data-testid="active-filters" className="flex flex-wrap items-center gap-2 font-['Montserrat']">
      {tags.map((tag, i) => (
        <button
          key={`${tag.key}-${tag.value}-${i}`}
          data-testid={`active-filter-${tag.key}-${tag.value}`}
          onClick={() => onRemove(tag.key, tag.value)}
          className="inline-flex items-center gap-[6px] bg-[#FFF7FC] text-[#CB2187] text-[12px] font-medium px-[12px] py-[6px] rounded-full hover:bg-[#FBE8F4] transition-colors cursor-pointer border border-[#e8b5d3]"
        >
          {tag.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      {tags.length > 1 && (
        <button
          data-testid="clear-all-active-filters"
          onClick={onClearAll}
          className="text-[12px] text-[#666] hover:text-[#CB2187] font-medium cursor-pointer bg-transparent border-none underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
