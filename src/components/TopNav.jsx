import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  Globe,
  Maximize2,
  Mic,
  MoonStar,
  ArrowRightLeft,
  Search,
  Settings,
  Share2,
  SunMedium
} from 'lucide-react';
import Fuse from 'fuse.js';

export default function TopNav({
  route,
  onSelectRouteCountry,
  onSwapRoute,
  searchResults,
  autoRotate,
  setAutoRotate,
  darkMode,
  setDarkMode,
  onScreenshot,
  onShare,
  onSettings,
  onFullscreen
}) {
  const [activeField, setActiveField] = useState(null);
  const [fromQuery, setFromQuery] = useState(route.from);
  const [toQuery, setToQuery] = useState(route.to);

  useEffect(() => {
    setFromQuery(route.from);
  }, [route.from]);

  useEffect(() => {
    setToQuery(route.to);
  }, [route.to]);

  const fuse = useMemo(
    () =>
      new Fuse(searchResults, {
        keys: ['name', 'capital', 'continent', 'search'],
        threshold: 0.35,
        ignoreLocation: true
      }),
    [searchResults]
  );

  const fromMatches = useMemo(() => filterMatches(fuse, searchResults, fromQuery), [fuse, searchResults, fromQuery]);
  const toMatches = useMemo(() => filterMatches(fuse, searchResults, toQuery), [fuse, searchResults, toQuery]);

  return (
    <header className="relative z-20 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-3 px-3 py-3 lg:px-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-blue-500/15 ring-1 ring-white/10">
              <Globe className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">World Globe Explorer</div>
              <div className="text-xs text-slate-400">Premium interactive Earth experience</div>
            </div>
          </div>

          <div className="grid flex-1 items-center gap-3 xl:grid-cols-[1fr_auto_1fr]">
            <RouteSearchField
              label="From"
              value={fromQuery}
              matches={fromMatches}
              active={activeField === 'from'}
              onFocus={() => setActiveField('from')}
              onChange={setFromQuery}
              onSelectCountry={(name) => {
                setFromQuery(name);
                setActiveField(null);
                onSelectRouteCountry('from', name, { flyDuration: 1400 });
              }}
            />

            <SwapRouteButton onClick={onSwapRoute} />

            <RouteSearchField
              label="To"
              value={toQuery}
              matches={toMatches}
              active={activeField === 'to'}
              onFocus={() => setActiveField('to')}
              onChange={setToQuery}
              onSelectCountry={(name) => {
                setToQuery(name);
                setActiveField(null);
                onSelectRouteCountry('to', name, { flyDuration: 1400 });
              }}
            />
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
      </div>
    </header>
  );
}

function RouteSearchField({ label, value, matches, active, onFocus, onChange, onSelectCountry }) {
  return (
    <div className="relative">
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glow">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-cyan-200">
          <Search className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
          <input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onFocus={onFocus}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches[0]) {
                onSelectCountry(matches[0].name);
              }
            }}
            placeholder={`Search ${label.toLowerCase()} country...`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>
        <button className="text-slate-400 transition hover:text-white" aria-label="Voice command placeholder">
          <Mic className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {active && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {matches.map((country) => (
              <button
                key={country.name}
                onClick={() => onSelectCountry(country.name)}
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
  );
}

function SwapRouteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-100"
      aria-label="Swap from and to countries"
      title="Swap route"
    >
      <ArrowRightLeft className="h-4 w-4 transition duration-300 group-hover:rotate-180" />
    </button>
  );
}

function filterMatches(fuse, searchResults, query) {
  if (!query) return searchResults.slice(0, 6);
  return fuse.search(query).map((result) => result.item).slice(0, 6);
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
