import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { geoCentroid } from 'd3-geo';
import * as THREE from 'three';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-110m.json';
import { countryLookupById } from '../data/countries';

const EARTH_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_BUMPS = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const CLOUDS = 'https://unpkg.com/three-globe/example/img/earth-clouds.png';

const GlobeScene = forwardRef(function GlobeScene(
  { selectedCountry, hoveredCountry, autoRotate, onHoverCountry, onSelectCountry, onTooltip, routeData },
  ref
) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [polygons, setPolygons] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const cloudTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const texture = new THREE.TextureLoader().load(CLOUDS);
    texture.anisotropy = 16;
    return texture;
  }, []);

  useEffect(() => {
    const countryFeatures = feature(countriesTopo, countriesTopo.objects.countries).features;
    const nextPolygons = countryFeatures.map((item) => {
      const country = countryLookupById[item.id];
      const name = country?.name || item.properties?.name || item.id || 'Unknown';
      const centroid = geoCentroid(item);
      return {
        ...item,
        name,
        coordinates: country?.coordinates || [centroid[1], centroid[0]],
        properties: {
          ...(item.properties || {}),
          name
        }
      };
    });
    setPolygons(nextPolygons);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const update = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height))
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!routeData) {
      setArcs([]);
      return;
    }
    setArcs([
      {
        startLat: routeData.from.coordinates[0],
        startLng: routeData.from.coordinates[1],
        endLat: routeData.to.coordinates[0],
        endLng: routeData.to.coordinates[1],
        color: ['#67e8f9', '#ffffff'],
        dashLength: 0.35,
        dashGap: 0.2,
        dashInitialGap: 1,
        arcDashAnimateTime: 2200
      }
    ]);
  }, [routeData]);

  useImperativeHandle(ref, () => ({
    flyToCountry(coordinates, duration = 1600) {
      const globe = globeRef.current;
      if (!globe) return;
      globe.pointOfView({ lat: coordinates[0], lng: coordinates[1], altitude: 1.8 }, duration);
    },
    flyToRoute(route) {
      const globe = globeRef.current;
      if (!globe) return;
      globe.pointOfView(
        {
          lat: (route.from.coordinates[0] + route.to.coordinates[0]) / 2,
          lng: (route.from.coordinates[1] + route.to.coordinates[1]) / 2,
          altitude: 2.1
        },
        1600
      );
    },
    getZoomLevel() {
      const controls = globeRef.current?.controls?.();
      const distance = controls?.getDistance?.();
      return distance ? Number((700 / distance).toFixed(2)) : 1;
    }
  }));

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (!controls) return;
    controls.autoRotate = autoRotate;
  }, [autoRotate]);

  const globeProps = useMemo(
    () => ({
      globeImageUrl: EARTH_TEXTURE,
      bumpImageUrl: EARTH_BUMPS,
      backgroundImageUrl: null,
      showAtmosphere: true,
      atmosphereColor: '#9be7ff',
      atmosphereAltitude: 0.27
    }),
    []
  );

  return (
    <div ref={containerRef} className="relative h-full min-h-[72vh] w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.09),transparent_40%)]" />
      <Globe
        ref={globeRef}
        {...globeProps}
        width={dimensions.width}
        height={dimensions.height}
        polygonsData={polygons}
        polygonsTransitionDuration={300}
        polygonAltitude={(polygon) => {
          if (selectedCountry?.name === polygon.name) return 0.08;
          if (hoveredCountry?.name === polygon.name) return 0.05;
          return 0.01;
        }}
        polygonCapColor={(polygon) => {
          if (selectedCountry?.name === polygon.name) return 'rgba(56, 189, 248, 0.5)';
          if (hoveredCountry?.name === polygon.name) return 'rgba(125, 211, 252, 0.34)';
          return 'rgba(255,255,255,0.02)';
        }}
        polygonSideColor={() => 'rgba(16, 24, 44, 0.36)'}
        polygonStrokeColor={(polygon) => {
          if (selectedCountry?.name === polygon.name) return '#7dd3fc';
          if (hoveredCountry?.name === polygon.name) return '#c4f1ff';
          return 'rgba(255,255,255,0.12)';
        }}
        polygonLabel={(polygon) => polygon.name}
        onPolygonHover={(polygon) => {
          onHoverCountry(polygon);
          onTooltip(polygon ? { label: polygon.name } : null);
        }}
        onPolygonClick={(polygon) => onSelectCountry(polygon.name)}
        labelsData={polygons}
        labelLat={(label) => label.coordinates[0]}
        labelLng={(label) => label.coordinates[1]}
        labelText={(label) => label.name}
        labelColor={(label) => {
          if (selectedCountry?.name === label.name) return '#ecfeff';
          if (hoveredCountry?.name === label.name) return '#ffffff';
          return 'rgba(226, 232, 240, 0.72)';
        }}
        labelAltitude={0.025}
        labelSize={(label) => {
          if (selectedCountry?.name === label.name) return 0.95;
          if (hoveredCountry?.name === label.name) return 0.82;
          return 0.6;
        }}
        labelResolution={2}
        labelIncludeDot={false}
        labelsTransitionDuration={300}
        onLabelClick={(label) => {
          onSelectCountry(label.name);
        }}
        onLabelHover={(label) => {
          if (label) {
            onHoverCountry(label);
            onTooltip({ label: label.name });
            return;
          }
          onHoverCountry(null);
          onTooltip(null);
        }}
        arcsData={arcs}
        arcColor={(arc) => arc.color}
        arcStroke={0.5}
        arcAltitude={0.26}
        arcDashLength={(arc) => arc.dashLength}
        arcDashGap={(arc) => arc.dashGap}
        arcDashInitialGap={(arc) => arc.dashInitialGap}
        arcDashAnimateTime={(arc) => arc.arcDashAnimateTime}
        arcLabel={(arc) => `${arc.startLat.toFixed(2)}, ${arc.startLng.toFixed(2)}`}
        atmosphereColor="#7dd3fc"
        backgroundColor="rgba(0,0,0,0)"
        customLayerData={[{ id: 'clouds' }]}
        customThreeObject={() =>
          new THREE.Mesh(
            new THREE.SphereGeometry(101.2, 72, 72),
            new THREE.MeshPhongMaterial({
              map: cloudTexture,
              transparent: true,
              opacity: 0.36,
              depthWrite: false
            })
          )
        }
        customThreeObjectUpdate={(obj) => {
          obj.position.set(0, 0, 0);
        }}
        enablePointerInteraction
        animateIn
        rendererConfig={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onGlobeReady={() => {
          const globe = globeRef.current;
          if (!globe) return;
          const controls = globe.controls();
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = 0.28;
          controls.enablePan = false;
          controls.minDistance = 180;
          controls.maxDistance = 760;
          controls.enableDamping = true;
          controls.dampingFactor = 0.08;
          globe.pointOfView({ lat: 20, lng: 50, altitude: 2.15 }, 0);
          const canvas = globe.renderer()?.domElement;
          canvas?.addEventListener('dblclick', () => {
            globe.pointOfView({ lat: 20, lng: 50, altitude: 2.15 }, 1200);
          });
        }}
        onZoomChange={() => {
          // Keep the component responsive to zoom without storing noisy state.
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#02040b] via-[#02040b]/70 to-transparent" />
    </div>
  );
});

export default GlobeScene;
