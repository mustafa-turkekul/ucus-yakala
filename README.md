# FlyHunt — Flight Price Comparison

A static flight ticket price comparison site built with vanilla HTML/CSS/JavaScript and the Amadeus Self-Service API. Deployable to GitHub Pages with zero backend.

## Setup

### 1. Get Amadeus API Credentials

1. Sign up at [developers.amadeus.com](https://developers.amadeus.com/)
2. Create a new app in the Self-Service portal
3. Copy your **API Key** and **API Secret**

### 2. Configure

Open `js/config.js` and replace the placeholder values:

```js
const AMADEUS_CONFIG = {
  API_KEY: 'YOUR_AMADEUS_API_KEY',      // ← paste here
  API_SECRET: 'YOUR_AMADEUS_API_SECRET', // ← paste here
  BASE_URL: 'https://test.api.amadeus.com',
};
```

> **Note:** The test environment (`test.api.amadeus.com`) provides 500 free requests/month. For production, switch to `api.amadeus.com` after going live in the Amadeus portal.

### 3. Run Locally

Open `index.html` directly in your browser, or use a local server to avoid CORS issues:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

### 4. Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` / `root`
4. Your site will be live at `https://yourusername.github.io/reponame/`

## Features

- **Popular Routes Dashboard** — cheapest flights from Istanbul, cached in localStorage for 1 hour
- **One-Way Search** — with airport autocomplete, date picker, passenger count
- **Sorted Results** — by price, duration, or departure time
- **Responsive** — works on mobile, tablet, and desktop

## API Rate Limits (Test)

- 10 requests/second
- 500 requests/month

The app throttles requests automatically to stay within the per-second limit.
