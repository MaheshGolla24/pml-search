import React from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";

/**
 * SearchButton Component
 * Submit button for the search bar with icon
 */
function SearchButton({ onClick, type = "submit" }) {
  return (
    <div className="w-full md:w-auto pt-1 sm:pt-2 md:pt-0 [.sticky-search-active_&]:pt-0">
      <button
        type={type}
        onClick={onClick}
        className="group w-full md:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#cb2187] to-[#9c1866] hover:from-[#b01e78] 
        hover:to-[#8a1459] text-white font-bold text-xs sm:text-base md:text-lg tracking-wide px-6 sm:px-12 py-4 sm:py-6 rounded-full 
        shadow-lg hover:shadow-xl transition-all active:scale-[0.985] [.sticky-search-active_&]:py-4 [.sticky-search-active_&]:px-8 [.sticky-search-active_&]:text-sm"
      >
        <Search
          size={18}
          className="sm:w-[22px] sm:h-[22px] [.sticky-search-active_&]:w-[18px] [.sticky-search-active_&]:h-[18px]"
        />
        <span>Search</span>
      </button>
    </div>
  );
}

SearchButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default SearchButton;
