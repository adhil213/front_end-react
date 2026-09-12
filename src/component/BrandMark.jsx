import React from 'react';

const BrandMark = ({ className = "w-9 h-9", iconClass = "w-5 h-5" }) => (
  <span
    className={`bg-gold rounded-[10px] flex items-center justify-center text-surface shrink-0 ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M5 6h12M5 18h12M5 4v16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="15.5" cy="12" r="3.4" fill="currentColor" />
    </svg>
  </span>
);

export default BrandMark;