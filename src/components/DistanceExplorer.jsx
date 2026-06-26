import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightLeft, Route } from 'lucide-react';

export default function DistanceExplorer({ route, setRoute, routeData, countries, onExplore }) {
  const options = countries.map((country) => country.name);

  const details = useMemo(() => routeData, [routeData]);

  return (
    <section className="border-t border-white/10 bg-black/15 px-4 py-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
        <Route className="h-4 w-4 text-cyan-300" />
        Distance Explorer
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto]">
        <select
          value={route.from}
          onChange={(e) => setRoute((current) => ({ ...current, from: e.target.value }))}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
        >
          {options.map((name) => (
            <option key={name} value={name} className="bg-slate-950">
              Country A: {name}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-center text-slate-500">
          <ArrowRightLeft className="h-4 w-4" />
        </div>

        <select
          value={route.to}
          onChange={(e) => setRoute((current) => ({ ...current, to: e.target.value }))}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
        >
          {options.map((name) => (
            <option key={name} value={name} className="bg-slate-950">
              Country B: {name}
            </option>
          ))}
        </select>

        <button
          onClick={onExplore}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
        >
          Explore Route
        </button>
      </div>

      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4 grid gap-3 md:grid-cols-4"
          >
            <Metric label="Distance" value={`${details.distanceKm.toLocaleString()} km`} />
            <Metric label="Flight Time" value={`${details.flightHours} hours`} />
            <Metric label="Bearing" value={`${details.direction.toFixed(0)}°`} />
            <Metric label="Coordinates" value={`${details.from.coordinates[0].toFixed(2)}, ${details.to.coordinates[1].toFixed(2)}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-100">{value}</div>
    </div>
  );
}
