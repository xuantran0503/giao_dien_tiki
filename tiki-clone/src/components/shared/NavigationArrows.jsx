import React from "react";
import "./NavigationArrows.css";

export const PrevArrow = ({ onClick, className = "" }) => (
  <button
    className={`nav-arrow nav-arrow-prev ${className}`}
    onClick={onClick}
    aria-label="Previous"
  >
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* <polyline points="15 18 9 12 15 6"></polyline> */}
      <path fillRule="evenodd" clipRule="evenodd" d="M12.0899 14.5899C11.7645 14.9153 11.2368 14.9153 10.9114 14.5899L5.91139 9.58991C5.58596 9.26447 5.58596 8.73683 5.91139 8.4114L10.9114 3.41139C11.2368 3.08596 11.7645 3.08596 12.0899 3.41139C12.4153 3.73683 12.4153 4.26447 12.0899 4.58991L7.67916 9.00065L12.0899 13.4114C12.4153 13.7368 12.4153 14.2645 12.0899 14.5899Z" fill="#0A68FF"></path>
    </svg>
  </button>
);

export const NextArrow = ({ onClick, className = "" }) => (
  <button
    className={`nav-arrow nav-arrow-next ${className}`}
    onClick={onClick}
    aria-label="Next"
  >
    {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg> */}


    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* <polyline points="15 18 9 12 15 6"></polyline> */}
      <path fillRule="evenodd" clipRule="evenodd" d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z" fill="#0A68FF"></path>
    </svg>
  </button>
);
