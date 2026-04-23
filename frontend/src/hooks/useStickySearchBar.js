import { useEffect, useRef } from "react";

/**
 * Custom hook for managing sticky search bar behavior
 * Detects when the search bar becomes sticky and adds/removes a global class
 * @param {React.Ref} sentinelRef - Ref to the sentinel element (should be above the sticky element)
 * @param {string} [className="sticky-search-active"] - Class to add when sticky
 */
export function useStickySearchBar(sentinelRef, className = "sticky-search-active") {
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(([entry]) => {
      // When the sentinel is not intersecting the viewport the bar is stuck
      if (!entry.isIntersecting) {
        document.documentElement.classList.add(className);
      } else {
        document.documentElement.classList.remove(className);
      }
    });

    obs.observe(sentinel);
    return () => {
      obs.disconnect();
      document.documentElement.classList.remove(className);
    };
  }, [className]);
}
