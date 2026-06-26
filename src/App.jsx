import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import TopNav from './components/TopNav';
import LeftSidebar from './components/LeftSidebar';
import BottomPanel from './components/BottomPanel';
import CountryPanel from './components/CountryPanel';
import CountrySpotlight from './components/CountrySpotlight';
import DistanceExplorer from './components/DistanceExplorer';
import SpaceBackdrop from './components/SpaceBackdrop';
import { countryProfiles, countryLookup, searchableCountries } from './data/countries';
import { computeRoute, formatCoordinates } from './utils/geo';
import { useLocalStorage } from './hooks/useLocalStorage';
const GlobeScene = React.lazy(() => import('./components/GlobeScene'));

const DEFAULT_COUNTRY = 'Pakistan';

export default function App() {
  const appShellRef = useRef(null);
  const globeRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(countryLookup[DEFAULT_COUNTRY]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [autoRotate, setAutoRotate] = useLocalStorage('wge-auto-rotate', true);
  const [darkMode, setDarkMode] = useLocalStorage('wge-dark-mode', true);
  const [bookmarks, setBookmarks] = useLocalStorage('wge-bookmarks', []);
  const [history, setHistory] = useLocalStorage('wge-history', []);
  const [route, setRoute] = useState({ from: 'Pakistan', to: 'United States' });
  const [routeData, setRouteData] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [countrySpotlightOpen, setCountrySpotlightOpen] = useLocalStorage('wge-country-spotlight', true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useLocalStorage('wge-left-sidebar-collapsed', false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useLocalStorage('wge-right-sidebar-collapsed', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    syncFullscreen();
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  useEffect(() => {
    const initialCountry = new URL(window.location.href).searchParams.get('country');
    if (initialCountry && countryLookup[initialCountry]) {
      focusCountry(initialCountry, { flyDuration: 0 });
    }
    // Only run on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!route.from || !route.to) {
      setRouteData(null);
      return;
    }
    setRouteData(computeRoute(route.from, route.to));
  }, [route]);

  const selectedMeta = selectedCountry
    ? {
        ...selectedCountry,
        ...(countryProfiles[selectedCountry.name] || {})
      }
    : null;

  function focusCountry(name, options = {}) {
    const country = countryLookup[name];
    if (!country) return;
    setSelectedCountry(country);
    setCountrySpotlightOpen(options.openSpotlight ?? true);
    setHistory((current) => {
      const next = [name, ...current.filter((item) => item !== name)];
      return next.slice(0, 12);
    });
    if (globeRef.current && country.coordinates) {
      globeRef.current.flyToCountry(country.coordinates, options.flyDuration ?? 1600);
    }
  }

  function toggleBookmark(name) {
    setBookmarks((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [name, ...current]
    );
  }

  function setRouteFromSelected(side = 'from') {
    if (!selectedCountry?.name) return;
    setRoute((current) => ({
      ...current,
      [side]: selectedCountry.name
    }));
  }

  function selectRouteCountry(side, name, options = {}) {
    const country = countryLookup[name];
    if (!country) return;
    setRoute((current) => ({ ...current, [side]: name }));
    focusCountry(name, { ...options, openSpotlight: true });
  }

  function handleScreenshot() {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `world-globe-${Date.now()}.png`;
      link.click();
    } catch {
      // Canvas export can be blocked if a browser refuses a remote texture.
      // The button intentionally fails softly rather than breaking the scene.
    }
  }

  function handleShare() {
    const url = new URL(window.location.href);
    if (selectedCountry) url.searchParams.set('country', selectedCountry.name);
    navigator.clipboard?.writeText(url.toString()).catch(() => {});
  }

  function handleFullscreen() {
    const target = appShellRef.current;
    if (!target) return;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {
        document.documentElement.requestFullscreen?.().catch(() => {});
      });
      return;
    }
    document.exitFullscreen?.().catch(() => {});
  }

  const bottomStats = useMemo(() => {
    const coords = selectedMeta?.coordinates || [0, 0];
    return {
      coordinates: formatCoordinates(coords),
      latitude: coords[0],
      longitude: coords[1],
      population: selectedMeta?.population ?? 0,
      area: selectedMeta?.area ?? 0,
      zoom: globeRef.current?.getZoomLevel?.() ?? 1
    };
  }, [selectedMeta, selectedCountry]);

  return (
    <div
      ref={appShellRef}
      className={`min-h-screen overflow-hidden bg-space-gradient text-slate-100 ${
        isFullscreen ? 'fixed inset-0 z-[100] h-screen w-screen' : ''
      }`}
    >
      <SpaceBackdrop />
      <TopNav
        route={route}
        onSelectRouteCountry={selectRouteCountry}
        searchResults={searchableCountries}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onScreenshot={handleScreenshot}
        onShare={handleShare}
        onSettings={() => {}}
        onFullscreen={handleFullscreen}
        onSelectCountry={focusCountry}
      />

      <main
        className={`relative mx-auto flex min-h-[calc(100vh-72px)] gap-4 px-3 pb-3 pt-3 lg:px-5 ${
          isFullscreen ? 'max-w-none' : 'max-w-[1920px]'
        }`}
      >
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() => setLeftSidebarCollapsed((value) => !value)}
          bookmarks={bookmarks}
          history={history}
          selectedCountry={selectedCountry}
          onSelectCountry={focusCountry}
          onToggleBookmark={toggleBookmark}
        />

        <section
          className={`relative flex min-h-[calc(100vh-96px)] flex-1 flex-col overflow-hidden border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-2xl ${
            isFullscreen ? 'rounded-none' : 'rounded-[32px]'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_30%)]" />
          <div
            className={`relative grid flex-1 grid-cols-1 ${
              rightSidebarCollapsed ? 'lg:grid-cols-[1fr_76px]' : 'lg:grid-cols-[1fr_360px]'
            }`}
          >
            <div className="relative min-h-[70vh]">
              <Suspense fallback={<GlobeLoading />}>
                <GlobeScene
                  ref={globeRef}
                  selectedCountry={selectedCountry}
                  hoveredCountry={hoveredCountry}
                  autoRotate={autoRotate}
                  onHoverCountry={setHoveredCountry}
                  onSelectCountry={focusCountry}
                  onTooltip={setTooltip}
                  routeData={routeData}
                />
              </Suspense>
            </div>

            <div className="relative border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0">
              <CountryPanel
                collapsed={rightSidebarCollapsed}
                onToggleCollapse={() => setRightSidebarCollapsed((value) => !value)}
                country={selectedCountry}
                selectedMeta={selectedMeta}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                onSelectCountry={focusCountry}
                onSetRouteFrom={() => setRouteFromSelected('from')}
                onSetRouteTo={() => setRouteFromSelected('to')}
              />
            </div>
          </div>

          <DistanceExplorer
            route={route}
            setRoute={setRoute}
            routeData={routeData}
            countries={searchableCountries}
            onExplore={() => routeData && globeRef.current?.flyToRoute(routeData)}
          />
          <BottomPanel stats={bottomStats} routeData={routeData} />
        </section>
      </main>

      <CountrySpotlight
        open={countrySpotlightOpen}
        country={selectedCountry}
        selectedMeta={selectedMeta}
        bookmarked={bookmarks.includes(selectedCountry?.name)}
        onClose={() => setCountrySpotlightOpen(false)}
        onToggleBookmark={() => toggleBookmark(selectedCountry?.name)}
        onSetRouteFrom={() => setRouteFromSelected('from')}
        onSetRouteTo={() => setRouteFromSelected('to')}
      />

      <div className="pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-slate-300 shadow-xl backdrop-blur-2xl">
          {tooltip?.label || 'Drag to rotate. Scroll to zoom. Double-click to reset.'}
        </div>
      </div>
    </div>
  );
}

function GlobeLoading() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-200" />
        <div className="text-sm text-slate-200">Loading globe engine</div>
        <div className="mt-1 text-xs text-slate-500">Optimizing textures and controls...</div>
      </div>
    </div>
  );
}
