import React, { useEffect, useState } from 'react';

export default function ImageUpload({ label, file, onChange, hint }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File || file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {previewUrl ? (
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border bg-cream flex-shrink-0">
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md border-2 border-dashed border-border bg-cream flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brown-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <label className="inline-block px-3 py-1.5 text-xs uppercase tracking-wider bg-brown-deep text-white rounded cursor-pointer hover:bg-brown-dark transition-colors">
            {file ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
          {file && (
            <button
              onClick={handleRemove}
              className="ml-2 text-xs text-brown-mid hover:text-brown-dark underline"
            >
              Remove
            </button>
          )}
          {hint && <p className="text-[10px] text-brown-light mt-1">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
