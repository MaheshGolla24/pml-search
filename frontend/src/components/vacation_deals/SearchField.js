import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * SearchField Component
 * Reusable search input field with dropdown results
 * Used for both destination and deal type searches
 */
const SearchField = forwardRef(
  (
    {
      icon: Icon,
      label,
      placeholder,
      query,
      onQueryChange,
      onFocus,
      results,
      isOpen,
      onResultSelect,
      showDropdown,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="group relative flex-1 w-full flex items-center rounded-lg sm:rounded-2xl md:rounded-3xl px-2 sm:px-5 py-3 sm:py-5
        transition-all hover:bg-pml-primary
        [.sticky-search-active_&]:py-2
        [.sticky-search-active_&]:rounded-full"
      >
        {/* Icon */}
        <div className="mr-2 sm:mr-4 rounded-full bg-[#f6eaf2] p-1.5 sm:p-2.5 text-[#cb2187] flex-shrink-0 
        [.sticky-search-active_&]:p-2">
          <Icon
            size={18}
            className="sm:w-[22px] sm:h-[22px] 
            [.sticky-search-active_&]:w-[18px] 
            [.sticky-search-active_&]:h-[18px]"
          />
        </div>

        {/* Input Container */}
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5 [.sticky-search-active_&]:text-[8px] 
          [.sticky-search-active_&]:mb-0">
            {label}
          </label>
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            className="w-full bg-transparent text-sm sm:text-lg font-semibold text-black placeholder:text-gray-400 outline-none [.sticky-search-active_&]:text-sm [.sticky-search-active_&]:sm:text-sm"
          />
        </div>

        {/* Dropdown */}
        {isOpen && results.length > 0 && showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={result.value}>
                  <button
                    type="button"
                    onClick={() => onResultSelect(result.label)}
                    className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-[#f6eaf2] hover:text-[#cb2187] transition-colors"
                  >
                    {result.label}
                    {result.count && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({result.count})
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SearchField.displayName = "SearchField";

SearchField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResultSelect: PropTypes.func.isRequired,
  showDropdown: PropTypes.bool,
};

SearchField.defaultProps = {
  showDropdown: true,
};

export default SearchField;
