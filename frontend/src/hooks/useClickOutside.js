import { useEffect, useRef } from "react";

/**
 * Custom hook for detecting clicks outside specified ref elements
 * @param {Object} options - Configuration options
 * @param {Array<React.Ref>} options.refs - Array of refs to monitor
 * @param {Function} options.callback - Function to call when click outside is detected
 * @param {boolean} [options.enabled=true] - Whether the hook is enabled
 */
export function useClickOutside({ refs, callback, enabled = true }) {
  const handleClickOutside = (event) => {
    // Check if click was outside all monitored refs
    const isClickOutside = refs.every((ref) => {
      return ref.current && !ref.current.contains(event.target);
    });

    if (isClickOutside && callback) {
      callback(event);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback, enabled]);
}
