import React, { useState } from 'react';

// A grouping wrapper that collapses a set of SectionAccordions under one header.
// Keeps the form panel short — e.g. all guide content sections live inside one group.
export default function CollapsibleGroup({ title, subtitle, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-3 border border-brown-deep/30 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-brown-deep text-white text-left hover:bg-brown-dark transition-colors"
      >
        <span className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium tracking-wide">{title}</span>
          {subtitle && <span className="block text-[10px] text-white/55 mt-0.5">{subtitle}</span>}
        </span>
        {count != null && (
          <span className="text-[10px] font-medium bg-white/15 rounded-full px-2 py-0.5 flex-shrink-0">
            {count}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-white/70 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && (
        <div className="p-2.5 bg-cream-dark/40">
          {children}
        </div>
      )}
    </div>
  );
}
