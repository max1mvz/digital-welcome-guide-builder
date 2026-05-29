import React, { useState, useEffect } from 'react';

export default function SectionAccordion({
  title,
  number,
  icon,
  children,
  defaultOpen = false,
  modalId,           // ID of the preview modal to open when this is open
  onOpenChange,      // (isOpen, modalId) => void
  enabled = true,    // controlled visibility (for default sections)
  onEnabledChange    // (newValue) => void — if provided, shows the toggle
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (onOpenChange) onOpenChange(open, modalId);
  }, [open, modalId]);

  const handleToggle = () => {
    // Don't allow opening a disabled section
    if (!enabled && !open) return;
    setOpen(!open);
  };

  const handleEnabledToggle = (e) => {
    e.stopPropagation();
    if (onEnabledChange) {
      const newVal = !enabled;
      onEnabledChange(newVal);
      // Close the section when disabling
      if (!newVal) setOpen(false);
    }
  };

  return (
    <div className={`bg-white border rounded-lg mb-3 overflow-hidden transition-all ${
      open ? 'accordion-open shadow-sm border-brown-deep' :
      enabled ? 'border-border' : 'border-border opacity-60'
    }`}>
      <div
        className="w-full flex items-center gap-2 px-3 py-3 text-left hover:bg-cream-light/50 transition-colors cursor-pointer"
        onClick={handleToggle}
      >
        {number && (
          <span className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center flex-shrink-0 ${
            enabled ? 'bg-brown-deep text-white' : 'bg-brown-light/30 text-brown-mid'
          }`}>
            {number}
          </span>
        )}
        {icon && <span className="text-brown-mid flex-shrink-0">{icon}</span>}
        <span className={`flex-1 text-sm font-medium tracking-wide ${
          enabled ? 'text-brown-dark' : 'text-brown-light line-through decoration-1'
        }`}>
          {title}
        </span>

        {/* Eye toggle — only shown for sections that pass onEnabledChange */}
        {onEnabledChange && (
          <button
            type="button"
            onClick={handleEnabledToggle}
            className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-colors ${
              enabled
                ? 'text-brown-mid hover:bg-brown-deep/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
            title={enabled ? 'Hide this section from guide' : 'Show this section'}
          >
            {enabled ? (
              // Eye open
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              // Eye off
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        )}

        <svg
          className={`accordion-arrow w-4 h-4 text-brown-mid flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      {open && enabled && (
        <div className="px-4 pb-4 pt-1 border-t border-border/40">
          {children}
        </div>
      )}
    </div>
  );
}
