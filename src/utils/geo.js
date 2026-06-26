import { geoCentroid } from 'd3-geo';
import { countryLookup } from '../data/countries';

export function formatNumber(value) {
  if (!value && value !== 0) return '—';
  return new Intl.NumberFormat('en-US').format(Number(value));
}

export function formatCoordinates([lat, lng] = [0, 0]) {
  return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
}

export function haversineDistanceKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function bearing([lat1, lon1], [lat2, lon2]) {
  const toRad = (value) => (value * Math.PI) / 180;
  const toDeg = (value) => (value * 180) / Math.PI;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function estimateFlightHours(distanceKm) {
  const avgCruiseSpeed = 850;
  return (distanceKm / avgCruiseSpeed + 1.5).toFixed(1);
}

export function routeCoordinates(from, to) {
  if (!from || !to) return [];
  return [from.coordinates, to.coordinates];
}

export function computeRoute(fromName, toName) {
  const from = countryLookup[fromName];
  const to = countryLookup[toName];
  if (!from || !to) return null;
  const distanceKm = Math.round(haversineDistanceKm(from.coordinates, to.coordinates));
  const direction = bearing(from.coordinates, to.coordinates);
  return {
    from,
    to,
    distanceKm,
    flightHours: estimateFlightHours(distanceKm),
    direction,
    coordinates: [from.coordinates, to.coordinates]
  };
}

export function centroidFromFeature(feature) {
  return geoCentroid(feature);
}
