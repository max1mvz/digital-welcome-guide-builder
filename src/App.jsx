import React, { useState, useEffect, useMemo, useRef } from 'react';
import { defaultData } from './utils/defaultData.js';
import FormPanel from './components/FormPanel.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import { saveProject, openProject } from './utils/projectFile.js';
import { saveAutosave, loadAutosave, clearAutosave } from './utils/autosave.js';

export default function App() {
  const [data, setData] = useState(defaultData);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [activeModalId, setActiveModalId] = useState(null);  // Which modal to auto-open in preview
  const [lastSaved, setLastSaved] = useState(null);          // Timestamp of last autosave
  const hydrated = useRef(false);                            // True once the initial autosave load has run

  // On first load, restore the most recent autosave (survives refresh / crash).
  useEffect(() => {
    let cancelled = false;
    loadAutosave()
      .then(record => {
        if (!cancelled && record && record.data) {
          setData({ ...defaultData, ...record.data });
          setLastSaved(record.savedAt);
        }
      })
      .finally(() => { hydrated.current = true; });
    return () => { cancelled = true; };
  }, []);

  // Debounced autosave on every change — but not until the initial load is done,
  // so we never overwrite a saved guide with the default placeholder data.
  useEffect(() => {
    if (!hydrated.current) return;
    const id = setTimeout(() => {
      saveAutosave(data).then(savedAt => { if (savedAt) setLastSaved(savedAt); });
    }, 800);
    return () => clearTimeout(id);
  }, [data]);

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
      clearAutosave();
      setLastSaved(null);
    }
  };

  const handleSave = async () => {
    try {
      await saveProject(data);
    } catch (err) {
      console.error(err);
      alert('Sorry, the project could not be saved.');
    }
  };

  const handleOpen = async () => {
    try {
      const loaded = await openProject();
      if (loaded) setData({ ...defaultData, ...loaded });
    } catch (err) {
      console.error(err);
      alert('Could not open that file. Please choose a .guide.json saved from this app.');
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
          {lastSaved && (
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
              Auto-saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
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
            onClick={handleOpen}
            className="px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 rounded-md transition-colors"
          >
            Open
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 rounded-md transition-colors"
          >
            Save
          </button>
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
