import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Clock3, Globe2, MapPin, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function LeftSidebar({
  collapsed,
  onToggleCollapse,
  bookmarks,
  history,
  selectedCountry,
  onSelectCountry,
  onToggleBookmark
}) {
  return (
    <aside
      className={`hidden shrink-0 flex-col gap-4 lg:flex ${
        collapsed ? 'w-[76px]' : 'w-[320px]'
      } transition-all duration-300`}
    >
      <button
        onClick={onToggleCollapse}
        className="glass flex items-center justify-between rounded-[22px] px-4 py-3 text-left shadow-2xl shadow-black/30"
      >
        <span className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? <PanelLeftOpen className="h-4 w-4 text-cyan-300" /> : <PanelLeftClose className="h-4 w-4 text-cyan-300" />}
          {!collapsed && <span className="text-sm font-medium text-slate-100">Sidebar</span>}
        </span>
      </button>

      {!collapsed && (
        <>
          <Panel title="Country Info" icon={Globe2}>
            <div className="space-y-3">
              <SidebarCountryCard
                label={selectedCountry?.name}
                subtitle={selectedCountry?.capital}
                meta={selectedCountry?.continent}
                onBookmark={() => onToggleBookmark(selectedCountry?.name)}
                bookmarked={bookmarks.includes(selectedCountry?.name)}
              />
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <Stat label="Population" value={selectedCountry?.population} />
                <Stat label="Area" value={selectedCountry?.area} />
              </div>
            </div>
          </Panel>

          <Panel title="Bookmarks" icon={Bookmark}>
            <div className="space-y-2">
              <AnimatePresence>
                {bookmarks.length ? (
                  bookmarks.map((country) => (
                    <motion.button
                      key={country}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={() => onSelectCountry(country)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-left text-sm transition hover:bg-white/10"
                    >
                      <span>{country}</span>
                      <MapPin className="h-4 w-4 text-cyan-300" />
                    </motion.button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
                    Save favorite locations here.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Panel>

          <Panel title="History" icon={Clock3}>
            <div className="space-y-2">
              {history.length ? (
                history.map((country) => (
                  <button
                    key={country}
                    onClick={() => onSelectCountry(country)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-left text-sm transition hover:bg-white/10"
                  >
                    <span>{country}</span>
                    <span className="text-xs text-slate-500">visited</span>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">
                  Recent selections appear here.
                </div>
              )}
            </div>
          </Panel>
        </>
      )}

      {collapsed && (
        <div className="glass flex flex-1 flex-col items-center gap-3 rounded-[28px] py-4 shadow-2xl shadow-black/30">
          <MiniAction icon={Globe2} active />
          <MiniAction icon={Bookmark} />
          <MiniAction icon={Clock3} />
        </div>
      )}
    </aside>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="glass rounded-[28px] p-4 shadow-2xl shadow-black/30">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-300" />
        <h2 className="text-sm font-medium tracking-wide text-slate-100">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SidebarCountryCard({ label, subtitle, meta, bookmarked, onBookmark }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-white/2 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{label || 'Select a country'}</div>
          <div className="text-sm text-slate-400">{subtitle || 'Capital city'}</div>
        </div>
        <button
          onClick={onBookmark}
          className={`grid h-10 w-10 place-items-center rounded-2xl border transition ${
            bookmarked ? 'border-amber-300/40 bg-amber-400/10 text-amber-200' : 'border-white/10 bg-white/5 text-slate-300'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{meta || 'Continent'}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-100">{value || '—'}</div>
    </div>
  );
}

function MiniAction({ icon: Icon, active = false }) {
  return (
    <div
      className={`grid h-11 w-11 place-items-center rounded-2xl border ${
        active ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-300'
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
