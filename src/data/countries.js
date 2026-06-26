import worldCountries from 'world-countries';

export const countryProfiles = {
  Pakistan: {
    name: 'Pakistan',
    capital: 'Islamabad',
    population: '240.5M',
    area: '881,913 km²',
    continent: 'Asia',
    coordinates: [30.3753, 69.3451],
    flag: '🇵🇰',
    timeZone: 'UTC+5',
    color: '#2dd4bf'
  },
  'United States': {
    name: 'United States',
    capital: 'Washington, D.C.',
    population: '334.9M',
    area: '9,833,520 km²',
    continent: 'North America',
    coordinates: [37.0902, -95.7129],
    flag: '🇺🇸',
    timeZone: 'Multiple',
    color: '#38bdf8'
  },
  Canada: {
    name: 'Canada',
    capital: 'Ottawa',
    population: '40.1M',
    area: '9,984,670 km²',
    continent: 'North America',
    coordinates: [56.1304, -106.3468],
    flag: '🇨🇦',
    timeZone: 'Multiple',
    color: '#60a5fa'
  },
  Japan: {
    name: 'Japan',
    capital: 'Tokyo',
    population: '125.1M',
    area: '377,975 km²',
    continent: 'Asia',
    coordinates: [36.2048, 138.2529],
    flag: '🇯🇵',
    timeZone: 'UTC+9',
    color: '#f97316'
  },
  Germany: {
    name: 'Germany',
    capital: 'Berlin',
    population: '84.4M',
    area: '357,022 km²',
    continent: 'Europe',
    coordinates: [51.1657, 10.4515],
    flag: '🇩🇪',
    timeZone: 'UTC+1',
    color: '#f59e0b'
  },
  India: {
    name: 'India',
    capital: 'New Delhi',
    population: '1.43B',
    area: '3,287,263 km²',
    continent: 'Asia',
    coordinates: [20.5937, 78.9629],
    flag: '🇮🇳',
    timeZone: 'UTC+5:30',
    color: '#f59e0b'
  },
  France: {
    name: 'France',
    capital: 'Paris',
    population: '68.4M',
    area: '551,695 km²',
    continent: 'Europe',
    coordinates: [46.2276, 2.2137],
    flag: '🇫🇷',
    timeZone: 'UTC+1',
    color: '#22c55e'
  },
  Brazil: {
    name: 'Brazil',
    capital: 'Brasília',
    population: '203.1M',
    area: '8,515,767 km²',
    continent: 'South America',
    coordinates: [-14.235, -51.9253],
    flag: '🇧🇷',
    timeZone: 'UTC-3',
    color: '#84cc16'
  },
  Australia: {
    name: 'Australia',
    capital: 'Canberra',
    population: '26.8M',
    area: '7,692,024 km²',
    continent: 'Oceania',
    coordinates: [-25.2744, 133.7751],
    flag: '🇦🇺',
    timeZone: 'UTC+10',
    color: '#38bdf8'
  },
  Egypt: {
    name: 'Egypt',
    capital: 'Cairo',
    population: '112.7M',
    area: '1,010,408 km²',
    continent: 'Africa',
    coordinates: [26.8206, 30.8025],
    flag: '🇪🇬',
    timeZone: 'UTC+2',
    color: '#facc15'
  },
  'United Kingdom': {
    name: 'United Kingdom',
    capital: 'London',
    population: '67.8M',
    area: '242,495 km²',
    continent: 'Europe',
    coordinates: [55.3781, -3.436],
    flag: '🇬🇧',
    timeZone: 'UTC+0',
    color: '#60a5fa'
  }
};

function normalizeWorldCountry(country) {
  const name = country?.name?.common || country?.name?.official || country?.cca3 || 'Unknown';
  const capital = Array.isArray(country?.capital) ? country.capital[0] : country?.capital || '—';
  const latlng = Array.isArray(country?.latlng) ? country.latlng : [0, 0];
  const population = country?.population ? new Intl.NumberFormat('en-US').format(country.population) : '—';
  const area = country?.area ? `${new Intl.NumberFormat('en-US').format(Math.round(country.area))} km²` : '—';
  const continent = country?.region || '—';
  const flag = country?.flag || '🏳️';
  const timeZone = Array.isArray(country?.timezones) && country.timezones.length ? country.timezones[0] : '—';

  return {
    name,
    capital,
    population,
    area,
    continent,
    coordinates: latlng,
    flag,
    timeZone,
    search: `${name} ${capital} ${continent} ${country?.subregion || ''}`.trim(),
    iso2: country?.cca2,
    iso3: country?.cca3,
    ccn3: country?.ccn3,
    geometry: country?.geometry
  };
}

const worldCountryLookup = Object.fromEntries(
  worldCountries.map((country) => {
    const normalized = normalizeWorldCountry(country);
    return [normalized.name, normalized];
  })
);

export const countryLookupById = Object.fromEntries(
  Object.values(worldCountryLookup)
    .filter((entry) => entry.ccn3)
    .map((entry) => [entry.ccn3, entry])
);

export const countryLookup = Object.fromEntries(
  Object.entries(worldCountryLookup).map(([name, fallback]) => {
    const profile = countryProfiles[name];
    return [name, profile ? { ...fallback, ...profile } : fallback];
  })
);

export const searchableCountries = Object.values(countryLookup);
