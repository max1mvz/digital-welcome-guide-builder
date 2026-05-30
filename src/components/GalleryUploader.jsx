import React, { useEffect, useState } from 'react';

// Thumbnail with its own object-URL lifecycle
function Thumb({ file, onRemove }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (file instanceof File || file instanceof Blob) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [file]);

  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border border-border bg-cream">
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

export default function GalleryUploader({ images = [], onChange, onActivate }) {
  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onChange([...(images || []), ...files]);
  };
  const removeAt = (i) => onChange((images || []).filter((_, idx) => idx !== i));

  return (
    <div className="mb-3">
      <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
        Gallery Images
      </label>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {(images || []).map((file, i) => (
          <Thumb key={i} file={file} onRemove={() => removeAt(i)} />
        ))}
        <label
          onClick={() => { if (onActivate) onActivate(); }}
          className="aspect-square rounded-md border-2 border-dashed border-border bg-white flex flex-col items-center justify-center cursor-pointer hover:border-brown-deep transition-colors text-brown-light"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider mt-1">Add</span>
          <input type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} className="hidden" />
        </label>
      </div>
      <p className="text-[10px] text-brown-light">
        {(images || []).length} image{(images || []).length === 1 ? '' : 's'} · You can select multiple at once.
      </p>
    </div>
  );
}
