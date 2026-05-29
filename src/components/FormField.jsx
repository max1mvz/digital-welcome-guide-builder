import React from 'react';

// Reusable text input
export function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-border rounded bg-white text-brown-dark placeholder:text-brown-light/60 focus:border-brown-deep focus:outline-none transition-colors"
      />
    </div>
  );
}

// Reusable textarea
export function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-border rounded bg-white text-brown-dark placeholder:text-brown-light/60 focus:border-brown-deep focus:outline-none transition-colors resize-y"
      />
    </div>
  );
}

// List editor — add/remove/edit string items
export function StringListEditor({ label, items, onChange, placeholder = 'Enter item' }) {
  const updateItem = (idx, value) => {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  };
  const removeItem = idx => {
    onChange(items.filter((_, i) => i !== idx));
  };
  const addItem = () => onChange([...items, '']);

  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <div className="space-y-1.5">
        {(items || []).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={e => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-1.5 text-sm border border-border rounded bg-white text-brown-dark focus:border-brown-deep focus:outline-none"
            />
            <button
              onClick={() => removeItem(i)}
              className="px-2 py-1 text-brown-light hover:text-red-600 transition-colors"
              title="Remove"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="text-xs text-brown-deep hover:underline mt-1"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

// Color picker
export function ColorField({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-9 rounded border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-border rounded bg-white text-brown-dark focus:border-brown-deep focus:outline-none font-mono"
        />
      </div>
    </div>
  );
}
