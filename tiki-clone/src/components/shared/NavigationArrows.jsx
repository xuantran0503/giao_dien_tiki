import React from "react";
import "./NavigationArrows.css";

export const PrevArrow = ({ onClick, className = "" }) => (
  <button
    className={`nav-arrow nav-arrow-prev ${className}`}
    onClick={onClick}
    aria-label="Previous"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
);

export const NextArrow = ({ onClick, className = "" }) => (
  <button
    className={`nav-arrow nav-arrow-next ${className}`}
    onClick={onClick}
    aria-label="Next"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
);
