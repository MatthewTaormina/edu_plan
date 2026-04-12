# Lesson 09 — Capstone: Dynamic Weather Dashboard

> **Course:** Vanilla JavaScript Fundamentals · **Time:** 180–240 minutes · **Domain:** Web Development

---

## 🎯 Learning Objectives

- [ ] Combine all JS course concepts into a real, working application
- [ ] Integrate a live external API (Open-Meteo — free, no key required)
- [ ] Build dynamic DOM rendering from API data
- [ ] Persist search history using `localStorage`
- [ ] Present loading, error, and success states clearly

---

## 📖 Project Overview

Build a **weather dashboard** that:
1. Accepts a city name from the user
2. Geocodes the city to lat/lon (using Open-Meteo's geocoding API)
3. Fetches the current weather and a 7-day forecast
4. Dynamically renders the results as weather cards
5. Stores recent searches in `localStorage` for quick re-selection

**APIs used (both free, no API key):**
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=CITY`
- Weather: `https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current_weather=true&daily=...`

---

## 📖 Application Architecture

Before writing code, plan the structure:

```
State:
  - currentCity: { name, lat, lon }
  - weather: { current, forecast }
  - recentSearches: string[]
  - isLoading: boolean
  - error: string | null

Flow:
  User types city → searchCity() → fetchCoordinates() → fetchWeather()
                  → renderWeather() + saveToHistory()
```

---

## Starter HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A real-time weather dashboard powered by Open-Meteo.">
    <title>Weather Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="app-header">
        <h1>🌤 Weather Dashboard</h1>
    </header>

    <main class="app-main">

        <!-- Search Section -->
        <section class="search-section" aria-label="City search">
            <form id="search-form">
                <label for="city-input" class="sr-only">Search for a city</label>
                <input
                    type="search"
                    id="city-input"
                    placeholder="Enter a city… (e.g. London)"
                    autocomplete="off"
                    required
                >
                <button type="submit">Search</button>
            </form>

            <!-- Recent Searches -->
            <div id="recent-searches" aria-label="Recent searches"></div>
        </section>

        <!-- Status Messages -->
        <div id="loading-indicator" class="spinner" aria-label="Loading weather data" hidden></div>
        <p id="error-message" class="error-banner" role="alert" hidden></p>

        <!-- Weather Output -->
        <section id="weather-output" hidden>
            <!-- Current weather card is injected here -->
            <div id="current-weather"></div>
            <!-- 7-day forecast cards are injected here -->
            <div id="forecast-grid" class="forecast-grid"></div>
        </section>

    </main>

    <script src="app.js" defer></script>
</body>
</html>
```

---

## Application Code

```javascript
// app.js
'use strict';

// =============================================================
// STATE
// =============================================================

const state = {
    currentCity:    null,
    weather:        null,
    recentSearches: loadFromStorage('recentSearches', []),
    isLoading:      false,
    error:          null,
};

// =============================================================
// DOM REFERENCES
// =============================================================

const searchForm       = document.querySelector('#search-form');
const cityInput        = document.querySelector('#city-input');
const loadingIndicator = document.querySelector('#loading-indicator');
const errorMessage     = document.querySelector('#error-message');
const weatherOutput    = document.querySelector('#weather-output');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastGrid     = document.querySelector('#forecast-grid');
const recentSearchesEl = document.querySelector('#recent-searches');

// =============================================================
// API LAYER
// =============================================================

async function geocodeCity(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Geocoding service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`No city found for "${cityName}". Check your spelling.`);
    }

    const { name, country, latitude, longitude } = data.results[0];
    return { name: `${name}, ${country}`, lat: latitude, lon: longitude };
}

async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude:           lat,
        longitude:          lon,
        current_weather:    'true',
        daily:              'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone:           'auto',
        forecast_days:      '7',
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather service error: ${response.status}`);
    }

    return response.json();
}

// =============================================================
// RENDERING
// =============================================================

// WMO Weather Codes → Human readable
function describeWeatherCode(code) {
    const descriptions = {
        0: '☀️ Clear sky',
        1: '🌤 Mainly clear',
        2: '⛅ Partly cloudy',
        3: '☁️ Overcast',
        45: '🌫 Fog',
        51: '🌦 Light drizzle',
        61: '🌧 Light rain',
        71: '🌨 Light snow',
        80: '🌦 Rain showers',
        85: '🌨 Snow showers',
        95: '⛈ Thunderstorm',
    };
    // Find the closest match for codes not explicitly listed
    const sortedCodes = Object.keys(descriptions).map(Number).sort((a, b) => a - b);
    const closest = sortedCodes.reduce((prev, curr) =>
        Math.abs(curr - code) < Math.abs(prev - code) ? curr : prev
    );
    return descriptions[closest] || 'Unknown';
}

function renderCurrentWeather(cityName, weather) {
    const { temperature, windspeed, weathercode } = weather.current_weather;

    currentWeatherEl.innerHTML = '';  // Clear previous

    const card = document.createElement('div');
    card.className = 'current-card';
    card.innerHTML = `
        <div class="current-card__location">
            <h2>${cityName}</h2>
            <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="current-card__condition">
            <span class="current-card__icon" aria-hidden="true">${describeWeatherCode(weathercode).split(' ')[0]}</span>
            <div>
                <p class="current-card__temp">${Math.round(temperature)}°C</p>
                <p class="current-card__desc">${describeWeatherCode(weathercode).substring(2)}</p>
            </div>
        </div>
        <dl class="current-card__details">
            <dt>Wind</dt>
            <dd>${Math.round(windspeed)} km/h</dd>
        </dl>
    `;
    currentWeatherEl.appendChild(card);
}

function renderForecast(daily) {
    forecastGrid.innerHTML = '';

    const days = daily.time;
    for (let i = 0; i < days.length; i++) {
        const date = new Date(days[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const rain    = daily.precipitation_sum[i];
        const code    = daily.weathercode[i];

        const card = document.createElement('article');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="forecast-card__day">${dayName}</p>
            <span class="forecast-card__icon" aria-hidden="true">${describeWeatherCode(code).split(' ')[0]}</span>
            <p class="forecast-card__temps">
                <span class="temp-max">${maxTemp}°</span>
                <span class="temp-min">${minTemp}°</span>
            </p>
            <p class="forecast-card__rain">🌧 ${rain.toFixed(1)} mm</p>
        `;
        forecastGrid.appendChild(card);
    }
}

function renderRecentSearches() {
    recentSearchesEl.innerHTML = '';
    if (state.recentSearches.length === 0) return;

    const label = document.createElement('p');
    label.textContent = 'Recent:';
    label.className = 'recent-label';
    recentSearchesEl.appendChild(label);

    state.recentSearches.slice(0, 5).forEach(city => {
        const btn = document.createElement('button');
        btn.textContent = city;
        btn.className = 'recent-chip';
        btn.addEventListener('click', () => {
            cityInput.value = city;
            runSearch(city);
        });
        recentSearchesEl.appendChild(btn);
    });
}

// =============================================================
// UI STATE HELPERS
// =============================================================

function setLoading(isLoading) {
    state.isLoading = isLoading;
    loadingIndicator.hidden = !isLoading;
    searchForm.querySelector('button').disabled = isLoading;
}

function showError(message) {
    state.error = message;
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    weatherOutput.hidden = true;
}

function clearStatus() {
    state.error = null;
    errorMessage.hidden = true;
}

// =============================================================
// MAIN SEARCH FLOW
// =============================================================

async function runSearch(cityName) {
    clearStatus();
    setLoading(true);

    try {
        const city    = await geocodeCity(cityName);
        const weather = await fetchWeather(city.lat, city.lon);

        state.currentCity = city;
        state.weather     = weather;

        // Update recent searches (deduplicated, most recent first)
        state.recentSearches = [
            city.name,
            ...state.recentSearches.filter(c => c !== city.name)
        ].slice(0, 5);
        saveToStorage('recentSearches', state.recentSearches);

        // Render
        renderCurrentWeather(city.name, weather);
        renderForecast(weather.daily);
        renderRecentSearches();

        weatherOutput.hidden = false;

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// =============================================================
// EVENT HANDLERS
// =============================================================

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) runSearch(city);
});

// =============================================================
// STORAGE UTILITIES
// =============================================================

function loadFromStorage(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// =============================================================
// INIT
// =============================================================

renderRecentSearches();

// Auto-load last searched city on page open
if (state.recentSearches.length > 0) {
    runSearch(state.recentSearches[0]);
}
```

---

## 🏗️ Assignments

### Submission Requirements

1. Implement the full weather dashboard as described above.
2. Add a **°C / °F toggle** button. Implement the unit conversion in JavaScript (no additional API call needed).
3. Add a **background gradient** that changes based on the current weather code (sunny = warm yellow/orange gradient, rainy = dark grey/blue, etc.).
4. Ensure the app works offline for the last searched city by caching the last API response in `localStorage`.

---

## ✅ Milestone Checklist

- [ ] The app fetches and displays real weather data
- [ ] Recent searches persist after a page refresh
- [ ] Loading, error, and success states are all clearly presented
- [ ] A non-existent city name shows a user-friendly error
- [ ] The 7-day forecast renders as individual cards

## 🏆 Milestone Complete!

**Vanilla JavaScript Fundamentals is complete.** You have built three real projects — a recipe book, a portfolio page, and a live weather dashboard — using nothing but HTML, CSS, and vanilla JavaScript.

You are ready for the next step: [a JavaScript framework](../../domains/web_dev/frontend_frameworks.md).
