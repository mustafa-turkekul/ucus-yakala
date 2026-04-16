// Search form logic, airport autocomplete, and flight result rendering

const Search = (() => {
  let _currentSort = 'price';
  let _lastResults = [];

  // ── Debounce helper ────────────────────────────────────────────────────────
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ── Airport Autocomplete ───────────────────────────────────────────────────
  function setupAutocomplete(inputEl, hiddenEl, dropdownEl) {
    const doSearch = debounce(async (val) => {
      if (val.length < 2) { dropdownEl.innerHTML = ''; dropdownEl.hidden = true; return; }
      try {
        const results = await AmadeusAPI.searchAirports(val);
        renderDropdown(results, inputEl, hiddenEl, dropdownEl);
      } catch {
        dropdownEl.innerHTML = '';
        dropdownEl.hidden = true;
      }
    }, 300);

    inputEl.addEventListener('input', () => {
      hiddenEl.value = '';
      doSearch(inputEl.value.trim());
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { dropdownEl.innerHTML = ''; dropdownEl.hidden = true; }
      if (e.key === 'ArrowDown') {
        const first = dropdownEl.querySelector('[role=option]');
        if (first) first.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
        dropdownEl.hidden = true;
      }
    });
  }

  function renderDropdown(airports, inputEl, hiddenEl, dropdownEl) {
    if (!airports.length) {
      dropdownEl.innerHTML = '<li class="dropdown-empty">No airports found</li>';
      dropdownEl.hidden = false;
      return;
    }

    dropdownEl.innerHTML = airports.map(a => `
      <li role="option" tabindex="0" data-iata="${a.iata}" data-label="${a.city} (${a.iata})">
        <span class="airport-iata">${a.iata}</span>
        <span class="airport-info">
          <span class="airport-city">${a.city}</span>
          <span class="airport-name">${a.name}, ${a.country}</span>
        </span>
      </li>
    `).join('');
    dropdownEl.hidden = false;

    dropdownEl.querySelectorAll('[role=option]').forEach(li => {
      li.addEventListener('click', () => selectAirport(li, inputEl, hiddenEl, dropdownEl));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') selectAirport(li, inputEl, hiddenEl, dropdownEl);
        if (e.key === 'ArrowDown') li.nextElementSibling?.focus();
        if (e.key === 'ArrowUp') {
          const prev = li.previousElementSibling;
          if (prev) prev.focus(); else inputEl.focus();
        }
      });
    });
  }

  function selectAirport(li, inputEl, hiddenEl, dropdownEl) {
    inputEl.value = li.dataset.label;
    hiddenEl.value = li.dataset.iata;
    dropdownEl.innerHTML = '';
    dropdownEl.hidden = true;
    inputEl.focus();
  }

  // ── Form Validation ────────────────────────────────────────────────────────
  function validateForm(originCode, destCode, date, adults) {
    if (!originCode) return 'Please select a valid origin airport.';
    if (!destCode) return 'Please select a valid destination airport.';
    if (originCode === destCode) return 'Origin and destination cannot be the same.';
    if (!date) return 'Please select a departure date.';
    if (new Date(date) < new Date(new Date().toDateString())) return 'Departure date must be today or in the future.';
    if (adults < 1 || adults > 9) return 'Number of passengers must be between 1 and 9.';
    return null;
  }

  // ── Result Rendering ───────────────────────────────────────────────────────
  function renderResults(flights, container, sortBar) {
    _lastResults = flights;
    _currentSort = 'price';

    // Update result count
    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = flights.length ? `${flights.length} uçuş bulundu` : '';

    if (!flights.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✈</div>
          <h3>Uçuş bulunamadı</h3>
          <p>Farklı tarih veya havalimanı deneyin.</p>
        </div>`;
      sortBar.hidden = true;
      return;
    }

    sortBar.hidden = false;
    _renderSorted(container);
  }

  function _renderSorted(container) {
    const sorted = [..._lastResults].sort((a, b) => {
      if (_currentSort === 'price') return a.price.total - b.price.total;
      if (_currentSort === 'duration') return _durationMinutes(a.duration) - _durationMinutes(b.duration);
      if (_currentSort === 'departure') return new Date(a.departure.time) - new Date(b.departure.time);
      return 0;
    });

    container.innerHTML = sorted.map(f => _flightCard(f)).join('');
  }

  function _durationMinutes(str) {
    const m = str.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
    return (parseInt(m?.[1] || 0) * 60) + parseInt(m?.[2] || 0);
  }

  function _fmt(isoTime) {
    const d = new Date(isoTime);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function _fmtDate(isoTime) {
    return new Date(isoTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function _flightCard(f) {
    const arrivalDate = _fmtDate(f.departure.time) !== _fmtDate(f.arrival.time)
      ? `<span class="next-day">+1</span>` : '';

    return `
      <article class="flight-card">
        <div class="flight-carrier">
          <div class="carrier-logo">${f.carrier.code}</div>
          <span class="carrier-name">${f.carrier.name}</span>
        </div>
        <div class="flight-times">
          <div class="time-block">
            <span class="time">${_fmt(f.departure.time)}</span>
            <span class="iata">${f.departure.iata}</span>
          </div>
          <div class="flight-route-info">
            <span class="duration">${f.duration}</span>
            <div class="route-line">
              <span class="dot"></span>
              <span class="line"></span>
              <span class="stops-badge ${f.stops === 0 ? 'direct' : ''}">${f.stopsLabel}</span>
              <span class="line"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="time-block">
            <span class="time">${_fmt(f.arrival.time)}${arrivalDate}</span>
            <span class="iata">${f.arrival.iata}</span>
          </div>
        </div>
        <div class="flight-price">
          <span class="price-amount">${f.price.currency} ${f.price.total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          <span class="price-label">kişi başı</span>
          ${f.seats <= 5 ? `<span class="seats-warning">Son ${f.seats} koltuk</span>` : ''}
        </div>
      </article>`;
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  function setSort(sort, container) {
    _currentSort = sort;
    _renderSorted(container);
  }

  // ── Skeletons ──────────────────────────────────────────────────────────────
  function showSkeletons(container, count = 5) {
    container.innerHTML = Array(count).fill(`
      <div class="flight-card skeleton">
        <div class="sk sk-sm"></div>
        <div class="sk sk-lg"></div>
        <div class="sk sk-md"></div>
      </div>`).join('');
  }

  return { setupAutocomplete, validateForm, renderResults, setSort, showSkeletons };
})();

// ── Init on DOMContentLoaded ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form         = document.getElementById('search-form');
  const originInput  = document.getElementById('origin-input');
  const originCode   = document.getElementById('origin-code');
  const originDrop   = document.getElementById('origin-dropdown');
  const destInput    = document.getElementById('dest-input');
  const destCode     = document.getElementById('dest-code');
  const destDrop     = document.getElementById('dest-dropdown');
  const dateInput    = document.getElementById('date-input');
  const adultsInput  = document.getElementById('adults-input');
  const resultsSection = document.getElementById('results-section');
  const resultsContainer = document.getElementById('results-container');
  const sortBar      = document.getElementById('sort-bar');
  const errorBanner  = document.getElementById('error-banner');
  const resultsTitle = document.getElementById('results-title');

  // Set minimum date to today
  dateInput.min = new Date().toISOString().split('T')[0];

  // Setup autocomplete
  Search.setupAutocomplete(originInput, originCode, originDrop);
  Search.setupAutocomplete(destInput, destCode, destDrop);

  // Clear buttons
  document.querySelectorAll('.input-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const hidden = document.getElementById(btn.dataset.hidden);
      const drop   = document.getElementById(btn.dataset.dropdown);
      if (target) target.value = '';
      if (hidden) hidden.value = '';
      if (drop)  { drop.innerHTML = ''; drop.hidden = true; }
      target?.focus();
    });
  });

  // Sort buttons
  sortBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    sortBar.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Search.setSort(btn.dataset.sort, resultsContainer);
  });

  // Search form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const origin = originCode.value.trim().toUpperCase();
    const dest   = destCode.value.trim().toUpperCase();
    const date   = dateInput.value;
    const adults = parseInt(adultsInput.value, 10);

    const validationError = Search.validateForm(origin, dest, date, adults);
    if (validationError) { showError(validationError); return; }

    // Show results section with skeletons
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    Search.showSkeletons(resultsContainer);
    sortBar.hidden = true;
    resultsTitle.textContent = `Flights from ${origin} to ${dest}`;

    try {
      const flights = await AmadeusAPI.searchFlights(origin, dest, date, adults);
      Search.renderResults(flights, resultsContainer, sortBar);
    } catch (err) {
      resultsContainer.innerHTML = '';
      sortBar.hidden = true;
      showError(err.message || 'Failed to fetch flights. Please try again.');
    }
  });

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.hidden = false;
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    errorBanner.hidden = true;
    errorBanner.textContent = '';
  }

  // Dismiss error on click
  errorBanner.addEventListener('click', hideError);
});
