import React, { useState } from 'react';
import { ICON_LIBRARY, ICONS_BY_ID } from '../utils/iconLibrary.js';

// Renders an inline SVG icon by id
function Icon({ id, className = 'w-5 h-5' }) {
  const entry = ICONS_BY_ID[id];
  if (!entry) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: entry.svg }}
    />
  );
}

export default function IconPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = ICONS_BY_ID[value];

  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2 border border-border rounded bg-white hover:border-brown-deep transition-colors text-left"
      >
        <span className="w-9 h-9 rounded-md bg-cream flex items-center justify-center text-brown-deep flex-shrink-0">
          {selected ? <Icon id={selected.id} className="w-5 h-5" /> : <span className="text-xs text-brown-light">?</span>}
        </span>
        <span className="flex-1 text-sm text-brown-dark">
          {selected ? selected.label : 'Choose an icon...'}
        </span>
        <svg className={`w-4 h-4 text-brown-mid transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 p-3 border border-border rounded bg-cream-light max-h-64 overflow-y-auto form-scroll">
          <div className="grid grid-cols-6 gap-1.5">
            {ICON_LIBRARY.map(icon => (
              <button
                key={icon.id}
                type="button"
                onClick={() => {
                  onChange(icon.id);
                  setOpen(false);
                }}
                className={`aspect-square rounded-md flex items-center justify-center transition-colors ${
                  value === icon.id
                    ? 'bg-brown-deep text-white'
                    : 'bg-white text-brown-dark hover:bg-brown-deep/10 border border-border'
                }`}
                title={icon.label}
              >
                <Icon id={icon.id} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { Icon };
