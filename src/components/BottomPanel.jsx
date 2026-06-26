import React from 'react';
import { Globe2, MapPinned, Radar, Route } from 'lucide-react';

export default function BottomPanel({ stats, routeData }) {
  return (
    <footer className="grid gap-3 border-t border-white/10 bg-black/30 px-4 py-4 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
      <BottomItem icon={MapPinned} label="Coordinates" value={stats.coordinates} />
      <BottomItem icon={Route} label="Distance" value={routeData ? `${routeData.distanceKm.toLocaleString()} km` : '—'} />
      <BottomItem icon={Radar} label="Flight Time" value={routeData ? `${routeData.flightHours} hours` : '—'} />
      <BottomItem icon={Globe2} label="Zoom Level" value={stats.zoom?.toFixed?.(2) ?? '—'} />
    </footer>
  );
}

function BottomItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/20 text-cyan-200">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
        <div className="text-sm text-slate-100">{value}</div>
      </div>
    </div>
  );
}
