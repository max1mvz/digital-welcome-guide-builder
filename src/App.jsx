import React, { useState, useEffect, useMemo } from 'react';
import { defaultData } from './utils/defaultData.js';
import FormPanel from './components/FormPanel.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import DownloadButton from './components/DownloadButton.jsx';

export default function App() {
  const [data, setData] = useState(defaultData);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [activeModalId, setActiveModalId] = useState(null);  // Which modal to auto-open in preview

  // Generic update — supports nested paths like "emergencyHospital.phone"
  const update = (path, value) => {
    setData(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      let target = next;
      for (let i = 0; i < parts.length - 1; i++) {
        target[parts[i]] = { ...target[parts[i]] };
        target = target[parts[i]];
      }
      target[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const updateImage = (key, file) => {
    setData(prev => ({
      ...prev,
      images: { ...prev.images, [key]: file }
    }));
  };

  const resetAll = () => {
    if (confirm('Reset all fields to default? This cannot be undone.')) {
      setData(defaultData);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-cream">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-brown-deep text-white border-b border-brown-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-display text-lg">
            G
          </div>
          <div>
            <h1 className="font-display text-lg tracking-wider leading-tight">Digital Welcome Guide</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/10 rounded-md p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 text-xs rounded ${previewMode === 'desktop' ? 'bg-white text-brown-dark' : 'text-white/70 hover:text-white'}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 text-xs rounded ${previewMode === 'mobile' ? 'bg-white text-brown-dark' : 'text-white/70 hover:text-white'}`}
            >
              Mobile
            </button>
          </div>
          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 rounded-md transition-colors"
          >
            Reset
          </button>
          <DownloadButton data={data} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <aside className="w-[420px] flex-shrink-0 bg-cream-light border-r border-border overflow-y-auto form-scroll">
          <FormPanel
            data={data}
            update={update}
            updateImage={updateImage}
            activeModalId={activeModalId}
            setActiveModalId={setActiveModalId}
          />
        </aside>

        {/* Right: Preview */}
        <main className="flex-1 bg-gradient-to-br from-cream-dark to-cream overflow-hidden">
          <PreviewPane data={data} mode={previewMode} activeModalId={activeModalId} />
        </main>
      </div>
    </div>
  );
}
