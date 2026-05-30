import React, { useEffect, useState } from 'react';

// Single video uploader with a small inline preview.
export default function VideoUpload({ file, onChange, onActivate }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File || file instanceof Blob) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(null);
  }, [file]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
  };

  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        Video (1 max)
      </label>

      {url ? (
        <div className="mb-2">
          <video src={url} controls playsInline className="w-full rounded-md border border-border bg-black max-h-44" />
        </div>
      ) : (
        <div className="w-full h-28 rounded-md border-2 border-dashed border-border bg-white flex flex-col items-center justify-center text-brown-light mb-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider mt-1">No video yet</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label
          onClick={() => { if (onActivate) onActivate(); }}
          className="inline-block px-3 py-1.5 text-xs uppercase tracking-wider bg-brown-deep text-white rounded cursor-pointer hover:bg-brown-dark transition-colors"
        >
          {file ? 'Replace' : 'Upload'}
          <input type="file" accept="video/*" onChange={handleChange} className="hidden" />
        </label>
        {file && (
          <button onClick={() => onChange(null)} className="text-xs text-brown-mid hover:text-red-600 underline">
            Remove
          </button>
        )}
      </div>
      <p className="text-[10px] text-brown-light mt-1">MP4 recommended. Large files increase the guide size.</p>
    </div>
  );
}
