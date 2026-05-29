import React from 'react';

// Curated Google Fonts list
export const DISPLAY_FONTS = [
  { name: 'Cormorant Garamond', style: 'Elegant serif' },
  { name: 'Playfair Display',   style: 'High-contrast serif' },
  { name: 'Lora',               style: 'Modern serif' },
  { name: 'EB Garamond',        style: 'Classical serif' },
  { name: 'Libre Baskerville',  style: 'Editorial serif' },
  { name: 'Cormorant Infant',   style: 'Refined serif' },
  { name: 'Italiana',           style: 'Italian serif' },
  { name: 'DM Serif Display',   style: 'Bold serif' },
  { name: 'Marcellus',          style: 'Roman serif' },
  { name: 'Spectral',           style: 'Editorial serif' },
  // Sans-serif options
  { name: 'Inter',              style: 'Modern sans' },
  { name: 'Poppins',            style: 'Geometric sans' },
  { name: 'Montserrat',         style: 'Urban sans' }
];

export const BODY_FONTS = [
  { name: 'Jost',               style: 'Clean geometric' },
  { name: 'Inter',              style: 'Modern sans' },
  { name: 'Poppins',            style: 'Geometric sans' },
  { name: 'Montserrat',         style: 'Urban sans' },
  { name: 'Work Sans',          style: 'Versatile sans' },
  { name: 'DM Sans',            style: 'Low-contrast sans' },
  { name: 'Nunito',             style: 'Rounded sans' },
  { name: 'Manrope',            style: 'Modern sans' },
  { name: 'Lato',               style: 'Friendly sans' },
  { name: 'Source Sans 3',      style: 'Adobe sans' },
  { name: 'Open Sans',          style: 'Web standard' },
  { name: 'Karla',              style: 'Grotesque sans' }
];

// Pre-load all fonts in the builder UI for live preview
const ALL_FONTS = Array.from(new Set([...DISPLAY_FONTS.map(f => f.name), ...BODY_FONTS.map(f => f.name)]));
const fontsHref = `https://fonts.googleapis.com/css2?${ALL_FONTS.map(n => `family=${encodeURIComponent(n).replace(/%20/g, '+')}:wght@300;400;500;600`).join('&')}&display=swap`;

// Inject the link tag once
if (typeof document !== 'undefined' && !document.getElementById('builder-fonts-link')) {
  const link = document.createElement('link');
  link.id = 'builder-fonts-link';
  link.rel = 'stylesheet';
  link.href = fontsHref;
  document.head.appendChild(link);
}

export default function FontPicker({ label, value, onChange, fonts }) {
  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-border rounded bg-white text-brown-dark focus:border-brown-deep focus:outline-none transition-colors"
        style={{ fontFamily: value ? `'${value}', sans-serif` : 'inherit' }}
      >
        {fonts.map(f => (
          <option key={f.name} value={f.name} style={{ fontFamily: `'${f.name}', sans-serif` }}>
            {f.name} — {f.style}
          </option>
        ))}
      </select>
      {value && (
        <p className="mt-2 px-3 py-2 bg-cream rounded text-sm" style={{ fontFamily: `'${value}', sans-serif` }}>
          The quick brown fox jumps over the lazy dog
        </p>
      )}
    </div>
  );
}
