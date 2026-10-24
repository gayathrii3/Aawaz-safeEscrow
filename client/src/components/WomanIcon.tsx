import React from 'react';

export const WomanIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Head & gentle feminine contour */}
    <circle cx="12" cy="8" r="4" />
    <path d="M8.5 8c0 2.5 1.5 4.5 3.5 4.5s3.5-2 3.5-4.5" />
    <path d="M5 21c0-3.5 3.1-6.5 7-6.5s7 3 7 6.5" />
  </svg>
);
