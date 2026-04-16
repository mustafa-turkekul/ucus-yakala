// Mock API — replaces Amadeus with realistic static data
// Drop in the real api.js (Amadeus version) when you have credentials.

const AmadeusAPI = (() => {

  // ── Airport database ───────────────────────────────────────────────────
  const AIRPORTS = [
    { iata: 'IST', name: 'Istanbul Airport',             city: 'Istanbul',      country: 'Turkey' },
    { iata: 'SAW', name: 'Sabiha Gökçen Airport',        city: 'Istanbul',      country: 'Turkey' },
    { iata: 'ESB', name: 'Esenboğa Airport',             city: 'Ankara',        country: 'Turkey' },
    { iata: 'ADB', name: 'Adnan Menderes Airport',       city: 'Izmir',         country: 'Turkey' },
    { iata: 'AYT', name: 'Antalya Airport',              city: 'Antalya',       country: 'Turkey' },
    { iata: 'LHR', name: 'Heathrow Airport',             city: 'London',        country: 'United Kingdom' },
    { iata: 'LGW', name: 'Gatwick Airport',              city: 'London',        country: 'United Kingdom' },
    { iata: 'CDG', name: 'Charles de Gaulle Airport',    city: 'Paris',         country: 'France' },
    { iata: 'ORY', name: 'Orly Airport',                 city: 'Paris',         country: 'France' },
    { iata: 'AMS', name: 'Amsterdam Schiphol Airport',   city: 'Amsterdam',     country: 'Netherlands' },
    { iata: 'FRA', name: 'Frankfurt Airport',            city: 'Frankfurt',     country: 'Germany' },
    { iata: 'MUC', name: 'Munich Airport',               city: 'Munich',        country: 'Germany' },
    { iata: 'FCO', name: 'Leonardo da Vinci Airport',    city: 'Rome',          country: 'Italy' },
    { iata: 'MXP', name: 'Malpensa Airport',             city: 'Milan',         country: 'Italy' },
    { iata: 'BCN', name: 'El Prat Airport',              city: 'Barcelona',     country: 'Spain' },
    { iata: 'MAD', name: 'Adolfo Suárez Airport',        city: 'Madrid',        country: 'Spain' },
    { iata: 'VIE', name: 'Vienna Airport',               city: 'Vienna',        country: 'Austria' },
    { iata: 'ZRH', name: 'Zürich Airport',               city: 'Zurich',        country: 'Switzerland' },
    { iata: 'ATH', name: 'Eleftherios Venizelos Airport',city: 'Athens',        country: 'Greece' },
    { iata: 'PRG', name: 'Václav Havel Airport',         city: 'Prague',        country: 'Czech Republic' },
    { iata: 'BUD', name: 'Budapest Ferenc Liszt Airport',city: 'Budapest',      country: 'Hungary' },
    { iata: 'WAW', name: 'Chopin Airport',               city: 'Warsaw',        country: 'Poland' },
    { iata: 'CPH', name: 'Copenhagen Airport',           city: 'Copenhagen',    country: 'Denmark' },
    { iata: 'ARN', name: 'Stockholm Arlanda Airport',    city: 'Stockholm',     country: 'Sweden' },
    { iata: 'OSL', name: 'Oslo Gardermoen Airport',      city: 'Oslo',          country: 'Norway' },
    { iata: 'HEL', name: 'Helsinki-Vantaa Airport',      city: 'Helsinki',      country: 'Finland' },
    { iata: 'LIS', name: 'Humberto Delgado Airport',     city: 'Lisbon',        country: 'Portugal' },
    { iata: 'BRU', name: 'Brussels Airport',             city: 'Brussels',      country: 'Belgium' },
    { iata: 'DXB', name: 'Dubai International Airport',  city: 'Dubai',         country: 'UAE' },
    { iata: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi',  country: 'UAE' },
    { iata: 'DOH', name: 'Hamad International Airport',  city: 'Doha',          country: 'Qatar' },
    { iata: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City',   country: 'Kuwait' },
    { iata: 'AMM', name: 'Queen Alia International Airport', city: 'Amman',     country: 'Jordan' },
    { iata: 'CAI', name: 'Cairo International Airport',  city: 'Cairo',         country: 'Egypt' },
    { iata: 'TLV', name: 'Ben Gurion Airport',           city: 'Tel Aviv',      country: 'Israel' },
    { iata: 'GYD', name: 'Heydar Aliyev Airport',        city: 'Baku',          country: 'Azerbaijan' },
    { iata: 'TBS', name: 'Tbilisi International Airport',city: 'Tbilisi',       country: 'Georgia' },
    { iata: 'EVN', name: 'Zvartnots Airport',             city: 'Yerevan',       country: 'Armenia' },
    { iata: 'JFK', name: 'John F. Kennedy Airport',      city: 'New York',      country: 'United States' },
    { iata: 'EWR', name: 'Newark Liberty Airport',       city: 'New York',      country: 'United States' },
    { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
    { iata: 'ORD', name: "O'Hare International Airport", city: 'Chicago',       country: 'United States' },
    { iata: 'BKK', name: 'Suvarnabhumi Airport',         city: 'Bangkok',       country: 'Thailand' },
    { iata: 'SIN', name: 'Changi Airport',               city: 'Singapore',     country: 'Singapore' },
    { iata: 'NRT', name: 'Narita International Airport', city: 'Tokyo',         country: 'Japan' },
    { iata: 'HND', name: 'Haneda Airport',               city: 'Tokyo',         country: 'Japan' },
    { iata: 'SVO', name: 'Sheremetyevo Airport',         city: 'Moscow',        country: 'Russia' },
    { iata: 'LED', name: 'Pulkovo Airport',              city: 'St. Petersburg',country: 'Russia' },
    { iata: 'KBP', name: 'Boryspil International Airport', city: 'Kyiv',        country: 'Ukraine' },
    { iata: 'BEG', name: 'Nikola Tesla Airport',         city: 'Belgrade',      country: 'Serbia' },
  ];

  // ── Airlines ───────────────────────────────────────────────────────────
  const AIRLINES = [
    { code: 'TK',  name: 'Turkish Airlines' },
    { code: 'PC',  name: 'Pegasus Airlines' },
    { code: 'BA',  name: 'British Airways' },
    { code: 'LH',  name: 'Lufthansa' },
    { code: 'AF',  name: 'Air France' },
    { code: 'KL',  name: 'KLM' },
    { code: 'EK',  name: 'Emirates' },
    { code: 'QR',  name: 'Qatar Airways' },
    { code: 'EY',  name: 'Etihad Airways' },
    { code: 'W6',  name: 'Wizz Air' },
    { code: 'FR',  name: 'Ryanair' },
    { code: 'VY',  name: 'Vueling' },
    { code: 'IB',  name: 'Iberia' },
    { code: 'AZ',  name: 'ITA Airways' },
    { code: 'OS',  name: 'Austrian Airlines' },
    { code: 'LX',  name: 'Swiss' },
    { code: 'SK',  name: 'SAS' },
    { code: 'AY',  name: 'Finnair' },
  ];

  // ── Helpers ────────────────────────────────────────────────────────────
  function _seededRand(seed) {
    // Simple deterministic PRNG so same search always returns same results
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  function _pickRand(arr, rand) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function _addMinutes(isoDate, minutes) {
    const d = new Date(isoDate);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  }

  function _fmtDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  function _hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  // Simulate network delay
  function _delay(ms = 600) {
    return new Promise(r => setTimeout(r, ms + Math.random() * 400));
  }

  // ── Airport Search ─────────────────────────────────────────────────────
  async function searchAirports(keyword) {
    await _delay(200);
    const q = keyword.toLowerCase();
    return AIRPORTS.filter(a =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 7);
  }

  // ── Flight Search ──────────────────────────────────────────────────────
  async function searchFlights(origin, destination, date, adults = 1) {
    await _delay(900);

    const seed = _hashStr(`${origin}${destination}${date}`);
    const rand = _seededRand(seed);

    const count = 6 + Math.floor(rand() * 8); // 6–13 results
    const flights = [];

    // Base price varies by route (rough realism)
    const basePrice = 60 + Math.floor(rand() * 300);

    for (let i = 0; i < count; i++) {
      const airline  = _pickRand(AIRLINES, rand);
      const stops    = rand() < 0.45 ? 0 : rand() < 0.8 ? 1 : 2;
      const flightMinutes = 60 + Math.floor(rand() * 600) + stops * 80;
      const depHour  = Math.floor(rand() * 22);
      const depMin   = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(rand() * 12)];
      const depTime  = `${date}T${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}:00`;
      const arrTime  = _addMinutes(depTime, flightMinutes);
      const priceMod = 0.75 + rand() * 0.8;
      const price    = Math.round(basePrice * priceMod * (1 + stops * 0.05) * adults);
      const stopsLabel = stops === 0 ? 'Direkt' : stops === 1 ? '1 Aktarma' : `${stops} Aktarma`;
      const seats    = rand() < 0.25 ? Math.ceil(rand() * 5) : Math.ceil(rand() * 50 + 5);

      flights.push({
        id: `MOCK-${i}-${seed}`,
        carrier: { code: airline.code, name: airline.name },
        departure: { time: depTime, iata: origin },
        arrival:   { time: arrTime,  iata: destination },
        duration:  _fmtDuration(flightMinutes),
        stops,
        stopsLabel,
        price: { total: price, currency: 'USD' },
        seats,
      });
    }

    return flights.sort((a, b) => a.price.total - b.price.total);
  }

  // ── Popular Destinations (for IST dashboard) ───────────────────────────
  async function getPopularDestinations(origin = 'IST') {
    await _delay(700);

    const POPULAR = [
      { dest: 'LHR', basePrice: 189 },
      { dest: 'CDG', basePrice: 159 },
      { dest: 'FRA', basePrice: 129 },
      { dest: 'AMS', basePrice: 145 },
      { dest: 'DXB', basePrice: 109 },
      { dest: 'DOH', basePrice: 119 },
      { dest: 'BCN', basePrice: 139 },
      { dest: 'FCO', basePrice: 125 },
      { dest: 'ATH', basePrice:  89 },
      { dest: 'CAI', basePrice:  79 },
      { dest: 'TBS', basePrice:  65 },
      { dest: 'GYD', basePrice:  72 },
    ];

    // Pick 8 and add slight random variation
    const today = new Date();
    return POPULAR.slice(0, 8).map((r, i) => {
      const rand = _seededRand(_hashStr(`${origin}${r.dest}${today.toDateString()}`));
      const priceMod = 0.9 + rand() * 0.25;
      const daysAhead = 7 + Math.floor(rand() * 60);
      const depDate = new Date(today);
      depDate.setDate(depDate.getDate() + daysAhead);

      return {
        origin,
        destination: r.dest,
        departureDate: depDate.toISOString().split('T')[0],
        price: Math.round(r.basePrice * priceMod),
        currency: 'USD',
      };
    });
  }

  return { searchAirports, searchFlights, getPopularDestinations };
})();

class APIError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.body = body;
  }
}
