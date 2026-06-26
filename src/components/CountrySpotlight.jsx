import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPinned, Route, Bookmark, Sparkles } from 'lucide-react';

export default function CountrySpotlight({
  open,
  country,
  selectedMeta,
  bookmarked,
  onClose,
  onToggleBookmark,
  onSetRouteFrom,
  onSetRouteTo
}) {
  return (
    <AnimatePresence>
      {open && country && selectedMeta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="glass relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 shadow-2xl shadow-black/50"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_30%)]" />

            <div className="relative grid min-h-[70vh] grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                      Country Spotlight
                    </div>
                    <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white">{selectedMeta.name}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20 p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.15),transparent_42%)]" />
                  <div className="relative grid gap-4 md:grid-cols-[180px_1fr]">
                    <div className="flex flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5 px-6 py-8">
                      <div className="text-7xl leading-none">{selectedMeta.flag}</div>
                      <div className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">
                        {selectedMeta.continent}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-5">
                        <div className="flex items-center gap-2 text-sm text-cyan-100">
                          <Sparkles className="h-4 w-4" />
                          Clicked country opened in a separate spotlight panel
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          The globe stays focused on this country while the detail panel stays open. You can
                          use the buttons below to set the route start or end point instantly.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <InfoTile label="Capital" value={selectedMeta.capital} />
                        <InfoTile label="Population" value={selectedMeta.population} />
                        <InfoTile label="Area" value={selectedMeta.area} />
                        <InfoTile label="Time Zone" value={selectedMeta.timeZone} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={onToggleBookmark}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      bookmarked
                        ? 'border-amber-300/40 bg-amber-400/10 text-amber-100'
                        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      {bookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                    </span>
                  </button>
                  <button
                    onClick={onSetRouteFrom}
                    className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Set as From
                    </span>
                  </button>
                  <button
                    onClick={onSetRouteTo}
                    className="rounded-2xl border border-blue-300/20 bg-blue-400/10 px-4 py-3 text-sm font-medium text-blue-100 transition hover:bg-blue-400/15"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MapPinned className="h-4 w-4" />
                      Set as To
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Map View</div>
                  <div className="mt-4 flex min-h-[420px] items-center justify-center rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),rgba(2,6,23,0.95)_68%)]">
                    <div className="text-center">
                      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-5xl shadow-glow">
                        {selectedMeta.flag}
                      </div>
                      <div className="mt-5 text-xl font-semibold">{selectedMeta.name}</div>
                      <div className="mt-2 text-sm text-slate-400">
                        Coordinates: {selectedMeta.coordinates?.map((value) => value.toFixed(2)).join(', ')}
                      </div>
                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
                        Separate country detail view active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm text-white">{value}</div>
    </div>
  );
}
