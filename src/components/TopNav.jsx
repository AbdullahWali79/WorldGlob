import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Maximize2, Mic, MoonStar, Search, Settings, Share2, SunMedium, Camera } from 'lucide-react';
import Fuse from 'fuse.js';

export default function TopNav({
  searchValue,
  setSearchValue,
  searchResults,
  autoRotate,
  setAutoRotate,
  darkMode,
  setDarkMode,
  onScreenshot,
  onShare,
  onSettings,
  onFullscreen,
  onSelectCountry
}) {
  const [open, setOpen] = useState(false);
  const fuse = useMemo(
    () =>
      new Fuse(searchResults, {
        keys: ['name', 'capital', 'continent', 'search'],
        threshold: 0.35,
        ignoreLocation: true
      }),
    [searchResults]
  );

  const matches = useMemo(() => {
    if (!searchValue) return searchResults.slice(0, 6);
    return fuse.search(searchValue).map((result) => result.item).slice(0, 6);
  }, [searchValue, fuse, searchResults]);

  return (
    <header className="relative z-20 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-3 px-3 py-3 lg:flex-row lg:items-center lg:px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-blue-500/15 ring-1 ring-white/10">
            <Globe className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">World Globe Explorer</div>
            <div className="text-xs text-slate-400">Premium interactive Earth experience</div>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glow">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && matches[0]) {
                  onSelectCountry(matches[0].name);
                  setSearchValue(matches[0].name);
                  setOpen(false);
                }
              }}
              placeholder="Search any country..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
            <button className="text-slate-400 transition hover:text-white" aria-label="Voice command placeholder">
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {open && matches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
              >
                {matches.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => {
                      onSelectCountry(country.name);
                      setSearchValue(country.name);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/6"
                  >
                    <span>{country.name}</span>
                    <span className="text-xs text-slate-500">{country.capital}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToggleButton active={autoRotate} onClick={() => setAutoRotate((value) => !value)} label="Auto Rotate" />
          <IconButton icon={darkMode ? SunMedium : MoonStar} onClick={() => setDarkMode((value) => !value)} />
          <IconButton icon={Settings} onClick={onSettings} />
          <IconButton icon={Camera} onClick={onScreenshot} />
          <IconButton icon={Share2} onClick={onShare} />
          <IconButton icon={Maximize2} onClick={onFullscreen} />
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ToggleButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm transition ${
        active
          ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-white/5 text-slate-300'
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-cyan-300' : 'bg-slate-500'}`} />
      {label}
    </button>
  );
}
