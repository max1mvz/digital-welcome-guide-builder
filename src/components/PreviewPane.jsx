import React, { useEffect, useRef, useState } from 'react';
import { buildPreviewDocument } from '../utils/livePreview.js';

export default function PreviewPane({ data, mode = 'desktop', activeModalId = null }) {
  const iframeRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(0);
  const lastUrlsRef = useRef([]);

  // Debounced regenerate on data change
  useEffect(() => {
    const t = setTimeout(() => {
      const { html, previewUrls } = buildPreviewDocument(data, activeModalId);

      // Cleanup previous URLs (revoke after iframe loads the new content)
      const oldUrls = lastUrlsRef.current;
      lastUrlsRef.current = Object.values(previewUrls);

      if (iframeRef.current) {
        iframeRef.current.srcdoc = html;
      }

      // Revoke old URLs after the new iframe content has rendered
      setTimeout(() => {
        oldUrls.forEach(u => URL.revokeObjectURL(u));
      }, 200);
    }, 350);
    return () => clearTimeout(t);
  }, [data, activeModalId]);

  // Reset iframe on mode change
  const containerClass = mode === 'mobile'
    ? 'w-[390px] h-[844px] max-h-full'
    : 'w-full h-full max-w-[1400px]';

  return (
    <div className="h-full w-full flex items-center justify-center p-6 overflow-auto">
      <div className={`${containerClass} bg-white rounded-2xl shadow-2xl overflow-hidden border border-border transition-all duration-300`}>
        <iframe
          key={iframeKey}
          ref={iframeRef}
          title="Guide Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}
