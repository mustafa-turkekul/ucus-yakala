// Popular routes dashboard — loads cheapest flights from IST on page load
// Caches results in localStorage for 1 hour to conserve API quota

const Dashboard = (() => {
  const CACHE_KEY = 'flight_dashboard_v1';
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

  // City name lookup for destinations (supplements API data)
  const CITY_NAMES = {
    LHR: 'London', CDG: 'Paris', AMS: 'Amsterdam', FCO: 'Rome',
    BCN: 'Barcelona', FRA: 'Frankfurt', DXB: 'Dubai', JFK: 'New York',
    LAX: 'Los Angeles', BKK: 'Bangkok', SIN: 'Singapore', NRT: 'Tokyo',
    CAI: 'Cairo', DUS: 'Düsseldorf', VIE: 'Vienna', ZRH: 'Zurich',
    MUC: 'Munich', MAD: 'Madrid', CPH: 'Copenhagen', ATH: 'Athens',
    TLV: 'Tel Aviv', GVA: 'Geneva', LIS: 'Lisbon', WAW: 'Warsaw',
    MXP: 'Milan', BRU: 'Brussels', OSL: 'Oslo', ARN: 'Stockholm',
    HEL: 'Helsinki', PRG: 'Prague', BUD: 'Budapest', BEG: 'Belgrade',
    KBP: 'Kyiv', LED: 'St. Petersburg', SVO: 'Moscow', ALA: 'Almaty',
    GYD: 'Baku', TBS: 'Tbilisi', EVN: 'Yerevan', SKT: 'Sialkot',
    DME: 'Moscow', DOH: 'Doha', AUH: 'Abu Dhabi', KWI: 'Kuwait',
    AMM: 'Amman', BEY: 'Beirut', BAH: 'Bahrain', MCT: 'Muscat',
  };

  // Destination emoji/icon mapping by region
  const DEST_EMOJI = {
    LHR: '🇬🇧', CDG: '🇫🇷', AMS: '🇳🇱', FCO: '🇮🇹', BCN: '🇪🇸',
    FRA: '🇩🇪', DXB: '🇦🇪', JFK: '🇺🇸', LAX: '🇺🇸', BKK: '🇹🇭',
    SIN: '🇸🇬', NRT: '🇯🇵', CAI: '🇪🇬', MUC: '🇩🇪', MAD: '🇪🇸',
    ATH: '🇬🇷', TLV: '🇮🇱', LIS: '🇵🇹', DOH: '🇶🇦', AUH: '🇦🇪',
    GYD: '🇦🇿', TBS: '🇬🇪', EVN: '🇦🇲',
  };

  function _getCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null; }
      return data;
    } catch { return null; }
  }

  function _setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch { /* storage full — ignore */ }
  }

  function _renderSkeletons(container) {
    container.innerHTML = Array(6).fill(`
      <div class="dest-card skeleton">
        <div class="sk sk-icon"></div>
        <div class="sk sk-sm"></div>
        <div class="sk sk-md"></div>
        <div class="sk sk-price"></div>
      </div>`).join('');
  }

  function _renderCards(destinations, container) {
    if (!destinations.length) {
      container.innerHTML = '<p class="dashboard-empty">No popular routes available right now.</p>';
      return;
    }

    container.innerHTML = destinations.map(d => {
      const cityName = CITY_NAMES[d.destination] || d.destination;
      const emoji    = DEST_EMOJI[d.destination] || '✈';
      const formattedDate = new Date(d.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const price    = parseFloat(d.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

      return `
        <article class="dest-card" role="button" tabindex="0"
          data-origin="${d.origin}"
          data-dest="${d.destination}"
          data-dest-label="${cityName} (${d.destination})"
          data-date="${d.departureDate}">
          <div class="dest-emoji">${emoji}</div>
          <h3 class="dest-city">${cityName}</h3>
          <p class="dest-code">${d.origin} → ${d.destination}</p>
          <p class="dest-date">${formattedDate}</p>
          <div class="dest-price">
            <span class="from-label">from</span>
            <span class="price-value">$${price}</span>
          </div>
        </article>`;
    }).join('');

    // Click / Enter to pre-fill search
    container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => _prefillSearch(card));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') _prefillSearch(card); });
    });
  }

  function _prefillSearch(card) {
    const originInput = document.getElementById('origin-input');
    const originCode  = document.getElementById('origin-code');
    const destInput   = document.getElementById('dest-input');
    const destCode    = document.getElementById('dest-code');
    const dateInput   = document.getElementById('date-input');

    if (originInput && originCode) {
      originInput.value = `Istanbul (${card.dataset.origin})`;
      originCode.value  = card.dataset.origin;
    }
    if (destInput && destCode) {
      destInput.value = card.dataset.destLabel;
      destCode.value  = card.dataset.dest;
    }
    if (dateInput) {
      // Only pre-fill date if it's in the future
      const cardDate = new Date(card.dataset.date);
      const today    = new Date(new Date().toDateString());
      if (cardDate >= today) dateInput.value = card.dataset.date;
    }

    // Scroll to search and submit
    const form = document.getElementById('search-form');
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })), 600);
  }

  // ── Adana Featured Card ────────────────────────────────────────────────
  function _renderAdanaFeatured() {
    const container = document.getElementById('adana-featured');
    if (!container) return;

    // Generate deterministic mock price for IST→ADA
    const rand = _seededRand ? _seededRand(_hashStr('ISTADA' + new Date().toDateString())) : null;
    const price = rand ? Math.round(45 + rand() * 40) : 59;
    const daysAhead = rand ? 3 + Math.floor(rand() * 14) : 7;
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + daysAhead);
    const formattedDate = depDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    const isoDate = depDate.toISOString().split('T')[0];

    container.innerHTML = `
      <article class="adana-card" role="button" tabindex="0"
        data-origin="IST"
        data-dest="ADA"
        data-dest-label="Adana (ADA)"
        data-date="${isoDate}">

        <div class="adana-bg-decor"></div>

        <div class="adana-left">
          <div class="adana-badge">🔥 Öne Çıkan Uçuş</div>
          <div class="adana-title">
            <span class="adana-city">Adana</span>
            <span class="adana-sub">Dünyanın En Önemli Havalimanı · ADA</span>
          </div>
          <div class="adana-route">
            <span class="adana-iata">IST</span>
            <span class="adana-arrow">✈ ──────</span>
            <span class="adana-iata">ADA</span>
          </div>
          <p class="adana-desc">Seyahat tarihinden itibaren <strong>${formattedDate}</strong> kalkışlı uçuşlar mevcut. Fırsatı kaçırma!</p>
        </div>

        <div class="adana-right">
          <div class="adana-price-wrap">
            <span class="adana-from">itibaren</span>
            <span class="adana-price">$${price}</span>
            <span class="adana-per">kişi başı</span>
          </div>
          <button class="adana-btn" type="button">Uçuşları Gör →</button>
        </div>

      </article>`;

    const card = container.querySelector('.adana-card');
    const trigger = () => _prefillSearch(card);
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', e => { if (e.key === 'Enter') trigger(); });
    container.querySelector('.adana-btn').addEventListener('click', e => { e.stopPropagation(); trigger(); });
  }

  // Tiny helpers reused from mock api scope — safe to duplicate here
  function _seededRand(seed) {
    let s = seed;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  }
  function _hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  async function load(origin = 'IST') {
    const container = document.getElementById('dashboard-grid');
    if (!container) return;

    _renderAdanaFeatured();
    _renderSkeletons(container);

    // Try cache first
    const cached = _getCache();
    if (cached) { _renderCards(cached, container); return; }

    try {
      const destinations = await AmadeusAPI.getPopularDestinations(origin);
      _setCache(destinations);
      _renderCards(destinations, container);
    } catch (err) {
      container.innerHTML = `
        <p class="dashboard-error">
          Could not load popular routes.
          <button id="dashboard-retry" class="retry-btn">Retry</button>
        </p>`;
      document.getElementById('dashboard-retry')?.addEventListener('click', () => load(origin));
    }
  }

  return { load };
})();

document.addEventListener('DOMContentLoaded', () => Dashboard.load('IST'));
