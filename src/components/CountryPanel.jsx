import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, Globe, MapPinned, Map, ThermometerSun, TimerReset, Clock3, SquareStack, BookOpen } from 'lucide-react';

export default function CountryPanel({
  country,
  selectedMeta,
  bookmarks,
  onToggleBookmark,
  onSetRouteFrom,
  onSetRouteTo
}) {
  if (!country || !selectedMeta) return null;

  const fields = [
    { label: 'Capital', value: selectedMeta.capital, icon: MapPinned },
    { label: 'Population', value: selectedMeta.population, icon: SquareStack },
    { label: 'Area', value: selectedMeta.area, icon: Map },
    { label: 'Continent', value: selectedMeta.continent, icon: Globe },
    { label: 'Coordinates', value: selectedMeta.coordinates.map((item) => item.toFixed(2)).join(', '), icon: Flag },
    { label: 'Time Zone', value: selectedMeta.timeZone, icon: Clock3 }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={country.name}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        className="h-full overflow-y-auto border-l border-white/10 p-5 scrollbar-thin"
      >
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Selected Country</div>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight">{selectedMeta.name}</h3>
              <p className="mt-2 text-sm text-slate-400">Hover, rotate, or explore route dynamics on the globe.</p>
            </div>
            <div className="text-5xl">{selectedMeta.flag}</div>
          </div>

          <button
            onClick={() => onToggleBookmark(selectedMeta.name)}
            className={`mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              bookmarks.includes(selectedMeta.name)
                ? 'border-amber-300/40 bg-amber-400/10 text-amber-100'
                : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {bookmarks.includes(selectedMeta.name) ? 'Remove Bookmark' : 'Save Bookmark'}
          </button>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={onSetRouteFrom}
              className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            >
              Set as From
            </button>
            <button
              onClick={onSetRouteTo}
              className="rounded-2xl border border-blue-300/20 bg-blue-400/10 px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-blue-400/15"
            >
              Set as To
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {fields.map((field) => (
              <InfoRow key={field.label} icon={field.icon} label={field.label} value={field.value} />
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-4">
            <div className="flex items-center gap-2 text-sm text-cyan-100">
              <ThermometerSun className="h-4 w-4" />
              Weather integration placeholder
            </div>
            <div className="text-sm text-slate-300">
              Live climate and population visualizations can be connected later without changing the layout.
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <BookOpen className="h-4 w-4" />
              AI assistant placeholder
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TimerReset className="h-4 w-4" />
              Voice command placeholder
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-cyan-200">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="max-w-[55%] text-right text-sm text-slate-100">{value || '—'}</span>
    </div>
  );
}
