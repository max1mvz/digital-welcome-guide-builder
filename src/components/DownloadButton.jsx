import React, { useState } from 'react';
import { generateGuideZip } from '../utils/generateZip.js';

export default function DownloadButton({ data }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await generateGuideZip(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      alert('Sorry, something went wrong generating the ZIP. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-white text-brown-dark text-xs uppercase tracking-wider font-medium rounded-md hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-wait"
    >
      {loading ? (
        <>
          <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
          </svg>
          Building...
        </>
      ) : success ? (
        <>
          <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Downloaded!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download ZIP
        </>
      )}
    </button>
  );
}
