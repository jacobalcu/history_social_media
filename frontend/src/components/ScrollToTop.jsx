import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Added in App.jsx
export default function ScrollToTop() {
  // Get current URL
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top anytime the url changes
    window.scrollTo(0, 0);
  }, [pathname]);

  // Doesn't return any HTML
  return null;
}
