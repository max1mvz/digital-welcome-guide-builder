// Generates the index.html for the user's downloadable guide.
// All values come from the form data; image references point to ./images/

import { iconSvgPath } from '../utils/iconLibrary.js';

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

// Builds a Google Fonts URL from chosen display + body families
function googleFontsHref(displayFamily, bodyFamily) {
  const families = [];
  if (displayFamily) {
    families.push(`family=${encodeURIComponent(displayFamily).replace(/%20/g, '+')}:wght@300;400;500;600`);
  }
  if (bodyFamily && bodyFamily !== displayFamily) {
    families.push(`family=${encodeURIComponent(bodyFamily).replace(/%20/g, '+')}:wght@300;400;500;600`);
  }
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

// Renders content paragraphs (split by double newline) for custom sections
function renderParagraphs(text = '') {
  return String(text)
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(p => `<p style="color:var(--brown-mid); font-size:0.95rem; line-height:1.9; margin-bottom:1rem;">${esc(p.trim())}</p>`)
    .join('\n          ');
}

// Social platform definitions — icon SVG (inner markup) + label
const SOCIAL_ICONS = {
  facebook:  '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="2.5"/>',
  tiktok:    '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  twitter:   '<path d="M4 4l8 10L4 22h2l7-8 6 8h5l-9-11 8-9h-2l-7 8-6-8H4z" fill="currentColor" stroke="none"/>',
  youtube:   '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>',
  pinterest: '<circle cx="12" cy="12" r="10"/><path d="M8 11.5a4 4 0 1 1 6.7 2.94c-.65.69-2.06.94-3 1.94-.4.43-.7 1.62-.7 1.62"/><line x1="12" y1="17" x2="11" y2="22"/>',
  linkedin:  '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'
};

function renderSocialLinks(d, options = {}) {
  const platforms = [
    ['facebook',  d.socialFacebook],
    ['instagram', d.socialInstagram],
    ['tiktok',    d.socialTiktok],
    ['twitter',   d.socialTwitter],
    ['youtube',   d.socialYoutube],
    ['pinterest', d.socialPinterest],
    ['linkedin',  d.socialLinkedin]
  ];
  const active = platforms.filter(([_, url]) => url && url.trim());
  if (!active.length) return '';
  const cls = options.footer ? 'social-link social-link--footer' : 'social-link';
  return `<div class="${options.footer ? 'social-links footer-socials' : 'social-links'}">
${active.map(([id, url]) => `        <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${id}" class="${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18" stroke-linecap="round" stroke-linejoin="round">${SOCIAL_ICONS[id]}</svg></a>`).join('\n')}
      </div>`;
}

const li = (arr = []) => arr.map(item => `<li>${esc(item)}</li>`).join('\n            ');

const ICON_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_EMAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const ICON_LOCATION = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICON_BACK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`;

// Determines image path with fallback
const img = (file, fallback) => file ? `images/${file}` : fallback;

// Builds a Google Maps URL for a nearby place.
// Uses an explicit pasted link if present, otherwise builds a search query
// from the place name + property city/country.
function buildMapsUrl(place, d) {
  if (place.mapsUrl && place.mapsUrl.trim()) return place.mapsUrl.trim();
  const parts = [place.name, d.locationLabel].filter(Boolean).join(' ');
  if (!parts) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
}

const ICON_MAP_PIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="14" height="14" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

// Builds a Google Maps DIRECTIONS url for the property (opens navigation on tap).
// Uses a pasted link's coordinates/query if available; opaque share links are used as-is;
// otherwise builds a destination from address + city + country.
function buildPropertyNavUrl(d) {
  const link = (d.propertyMapsUrl || '').trim();
  let dest = '';
  if (link) {
    const at = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (at) {
      dest = `${at[1]},${at[2]}`;
    } else {
      const q = link.match(/[?&]q=([^&]+)/);
      const search = link.match(/maps\/search\/([^/?@]+)/);
      if (q) dest = decodeURIComponent(q[1].replace(/\+/g, ' '));
      else if (search) dest = decodeURIComponent(search[1].replace(/\+/g, ' '));
      else return link; // opaque share link (e.g. maps.app.goo.gl) — open directly
    }
  }
  if (!dest) dest = d.locationLabel || '';
  if (!dest) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

// Builds a keyless Google Maps EMBED url (interactive map iframe, no API key).
// Prefers coordinates/query parsed from a pasted link; otherwise uses name + city/country.
function buildMapEmbed(place, d) {
  let query = '';
  const link = (place.mapsUrl || '').trim();
  if (link) {
    // Try to pull "@lat,lng" coordinates from a pasted Maps URL
    const at = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (at) {
      query = `${at[1]},${at[2]}`;
    } else {
      // Try a ?q= or /search/<query> fragment
      const q = link.match(/[?&]q=([^&]+)/);
      const search = link.match(/maps\/search\/([^/?@]+)/);
      if (q) query = decodeURIComponent(q[1].replace(/\+/g, ' '));
      else if (search) query = decodeURIComponent(search[1].replace(/\+/g, ' '));
    }
  }
  if (!query) {
    query = [place.name, d.locationLabel].filter(Boolean).join(' ');
  }
  if (!query) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

const modalCover = (id, imageFile, title, subtitle) => `
      <div class="modal-cover" ${imageFile ? `style="background-image: url('images/${imageFile}')"` : ''}>
        <div class="cover-overlay"></div>
        <div class="cover-content">
          <div class="cover-line"></div>
          <h2 class="cover-title">${esc(title)}</h2>
          <div class="cover-line"></div>
          <p class="cover-subtitle">${esc(subtitle)}</p>
        </div>
      </div>`;

const modalHeader = (title) => `
    <header class="modal-header">
      <button class="modal-back" aria-label="Go back">${ICON_BACK}</button>
      <span class="modal-title">${esc(title)}</span>
      <span></span>
    </header>`;

export function generateHTML(d, imageNames = {}) {
  const propTitle = esc(d.propertyName || 'Welcome Guide');
  // Default to all sections enabled if not specified
  const enabled = d.enabledSections || {};
  const isOn = (key) => enabled[key] !== false; // treat undefined as enabled

  const fontsHref = googleFontsHref(d.fontDisplay || 'Cormorant Garamond', d.fontBody || 'Jost');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${propTitle} — ${esc(d.tagline || 'Guest Guide')}</title>
  <meta name="description" content="Your complete guest guide for ${propTitle}.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsHref}" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- ======== HERO ======== -->
  <section id="welcome" class="hero-section"${imageNames.hero ? ` style="background-image: url('images/${imageNames.hero}')"` : ''}>
    <div class="hero-overlay"></div>
    <div class="hero-card">

      ${imageNames.logo ? `<img class="hero-logo" src="images/${imageNames.logo}" alt="${propTitle}">` : `<h1 style="font-family:var(--font-display); color:#fff; font-size:2rem; letter-spacing:0.1em; margin-bottom:1.75rem;">${propTitle}</h1>`}

      <div class="hero-info-list">
        <div class="hero-info-row">
          <span class="hero-info-icon">${ICON_PHONE}</span>
          <span>${esc(d.phone || '')}</span>
        </div>
        <div class="hero-info-row">
          <span class="hero-info-icon">${ICON_EMAIL}</span>
          <span>${esc(d.email || '')}</span>
        </div>
        ${(() => {
          const navUrl = buildPropertyNavUrl(d);
          const locText = esc(d.locationLabel || '') || 'View location';
          if (navUrl) {
            return `<a class="hero-info-row hero-info-row--link" href="${esc(navUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="hero-info-icon">${ICON_LOCATION}</span>
          <span>${locText}</span>
          <span class="hero-info-go" aria-hidden="true">↗</span>
        </a>`;
          }
          return `<div class="hero-info-row">
          <span class="hero-info-icon">${ICON_LOCATION}</span>
          <span>${locText}</span>
        </div>`;
        })()}
      </div>

      <div class="hero-cta-wrap">
        <button class="hero-click-btn" onclick="document.getElementById('guide-index').scrollIntoView({behavior:'smooth'})">CLICK</button>
        <div class="hero-arrow-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

    </div>
  </section>

  <!-- ======== GUIDE INDEX GRID ======== -->
  <section class="guide-index" id="guide-index">
    <div class="container">
      <p class="guide-index-label">The Guide</p>
      <div class="guide-grid">

        ${isOn('welcome') ? `<button class="guide-card" data-modal="modal-welcome">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Welcome</span>
        </button>` : ''}

        ${isOn('accommodations') ? `<button class="guide-card" data-modal="modal-accommodations">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 16h20M6 8v8"/></svg>
          <span>Accommodations</span>
        </button>` : ''}

        ${isOn('checkin') ? `<button class="guide-card" data-modal="modal-checkin">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>
          <span>Check-in / Out</span>
        </button>` : ''}

        ${isOn('amenities') ? `<button class="guide-card" data-modal="modal-amenities">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Amenities</span>
        </button>` : ''}

        ${isOn('wifi') ? `<button class="guide-card" data-modal="modal-wifi">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20" stroke-width="2.5"/></svg>
          <span>WiFi</span>
        </button>` : ''}

        ${isOn('rules') ? `<button class="guide-card" data-modal="modal-rules">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>House Rules</span>
        </button>` : ''}

        ${isOn('kitchen') ? `<button class="guide-card" data-modal="modal-kitchen">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
          <span>Kitchen &amp; Dining</span>
        </button>` : ''}

        ${isOn('nearby') ? `<button class="guide-card" data-modal="modal-nearby">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          <span>Explore Nearby</span>
        </button>` : ''}

        ${isOn('emergency') ? `<button class="guide-card" data-modal="modal-emergency">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/></svg>
          <span>Emergency</span>
        </button>` : ''}

        ${isOn('pets') ? `<button class="guide-card" data-modal="modal-pets">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>
          <span>Pet Policy</span>
        </button>` : ''}

        ${isOn('reviews') ? `<button class="guide-card" data-modal="modal-reviews">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Guest Reviews</span>
        </button>` : ''}

        ${isOn('contact') ? `<button class="guide-card" data-modal="modal-contact">
          <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>Contact</span>
        </button>` : ''}

${(d.customSections || []).map(cs => {
  const iconSvg = `<svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconSvgPath(cs.icon)}</svg>`;
  if (cs.linkType === 'external' && cs.externalUrl) {
    return `        <a class="guide-card" href="${esc(cs.externalUrl)}" target="_blank" rel="noopener noreferrer">
          ${iconSvg}
          <span>${esc(cs.title || 'Section')}<span class="guide-card-ext">↗</span></span>
        </a>`;
  }
  return `        <button class="guide-card" data-modal="modal-custom-${esc(cs.id)}">
          ${iconSvg}
          <span>${esc(cs.title || 'Section')}</span>
        </button>`;
}).join('\n\n')}

      </div>
    </div>
  </section>

  <!-- ======== FOOTER ======== -->
  <footer>
    <div class="container">
      <p class="footer-logo">${propTitle}</p>
      <p>Made with care for our wonderful guests</p>
      ${renderSocialLinks(d, { footer: true })}
      <p class="footer-copy">© ${new Date().getFullYear()} ${propTitle} · All rights reserved</p>
    </div>
  </footer>

  <!-- ============ MODALS ============ -->

  <!-- MODAL: WELCOME -->
  <div class="modal" id="modal-welcome" role="dialog" aria-modal="true" aria-label="Welcome">${modalHeader('Welcome')}
    <div class="modal-body">${modalCover('welcome', imageNames.coverWelcome, 'Welcome', 'So glad you are here')}
      <div class="modal-content"><div class="container">
        <div class="card">
          <p class="card-label">A Note From Us</p>
          <p style="color:var(--brown-mid); font-size:0.95rem; line-height:1.9; margin-bottom:1rem;">${esc(d.welcomeNote1 || '')}</p>
          <p style="color:var(--brown-mid); font-size:0.95rem; line-height:1.9; margin-bottom:1rem;">${esc(d.welcomeNote2 || '')}</p>
          <p style="color:var(--brown-mid); font-size:0.95rem; line-height:1.9; margin-bottom:1.5rem;">${esc(d.welcomeNote3 || '')}</p>
          <div class="divider"></div>
          <p style="color:var(--brown-mid); font-size:0.95rem; line-height:1.9; margin-top:1.5rem;">With warmth,</p>
          <p style="font-family:var(--font-display); font-size:1.5rem; font-weight:400; color:var(--brown-dark); letter-spacing:0.04em; margin-top:0.25rem;">${propTitle}</p>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: ACCOMMODATIONS -->
  <div class="modal" id="modal-accommodations" role="dialog" aria-modal="true" aria-label="Accommodations">${modalHeader('Accommodations')}
    <div class="modal-body">${modalCover('acc', imageNames.coverAccommodations, 'Accommodations', 'Your private retreat, thoughtfully prepared')}
      <div class="modal-content"><div class="container">
        <div class="card">
          <p class="card-label">The Property</p>
          <h3>${esc(d.accomDescription || '')}</h3>
          <div class="divider"></div>
          <ul class="detail-list">
            <li><span class="detail-label">Bedrooms</span><span>${esc(d.accomBedrooms || '')}</span></li>
            <li><span class="detail-label">Bathrooms</span><span>${esc(d.accomBathrooms || '')}</span></li>
            <li><span class="detail-label">Kitchen</span><span>${esc(d.accomKitchen || '')}</span></li>
            <li><span class="detail-label">Entertainment</span><span>${esc(d.accomEntertainment || '')}</span></li>
            <li><span class="detail-label">Climate</span><span>${esc(d.accomClimate || '')}</span></li>
            <li><span class="detail-label">Entry</span><span>${esc(d.accomEntry || '')}</span></li>
            <li><span class="detail-label">Parking</span><span>${esc(d.accomParking || '')}</span></li>
          </ul>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: CHECK-IN / CHECK-OUT -->
  <div class="modal" id="modal-checkin" role="dialog" aria-modal="true" aria-label="Check-in and Check-out">${modalHeader('Check-in & Check-out')}
    <div class="modal-body">${modalCover('check', imageNames.coverCheckin, 'Check-in & Check-out', 'Everything you need for a seamless arrival and departure')}
      <div class="modal-content"><div class="container">
        <div class="two-col">
          <div class="card">
            <p class="card-label">Arrival</p>
            <div class="time-block">
              <span class="time-value">${esc(d.checkinTime || '')}</span>
              <span class="time-note">${esc(d.checkinNote || '')}</span>
            </div>
            <div class="divider"></div>
            <p class="card-sublabel">Arrival Instructions</p>
            <ol class="step-list">
            ${li(d.checkinSteps || [])}
            </ol>
          </div>
          <div class="card">
            <p class="card-label">Departure</p>
            <div class="time-block">
              <span class="time-value">${esc(d.checkoutTime || '')}</span>
              <span class="time-note">${esc(d.checkoutNote || '')}</span>
            </div>
            <div class="divider"></div>
            <ul class="check-list">
            ${li(d.checkoutTasks || [])}
            </ul>
          </div>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: AMENITIES -->
  <div class="modal" id="modal-amenities" role="dialog" aria-modal="true" aria-label="Amenities">${modalHeader('Amenities')}
    <div class="modal-body">${modalCover('amen', imageNames.coverAmenities, 'Amenities', 'Everything provided for your comfort')}
      <div class="modal-content"><div class="container">
        <div class="amenity-grid">
          <div class="amenity-category"><p class="card-label">Sleeping</p><ul>${li(d.amenitySleeping || [])}</ul></div>
          <div class="amenity-category"><p class="card-label">Bathroom</p><ul>${li(d.amenityBathroom || [])}</ul></div>
          <div class="amenity-category"><p class="card-label">Living Room</p><ul>${li(d.amenityLiving || [])}</ul></div>
          <div class="amenity-category"><p class="card-label">Workspace</p><ul>${li(d.amenityWorkspace || [])}</ul></div>
          <div class="amenity-category"><p class="card-label">Kitchen</p><ul>${li(d.amenityKitchen || [])}</ul></div>
          <div class="amenity-category"><p class="card-label">Outdoor</p><ul>${li(d.amenityOutdoor || [])}</ul></div>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: WIFI -->
  <div class="modal" id="modal-wifi" role="dialog" aria-modal="true" aria-label="WiFi">${modalHeader('WiFi & Internet')}
    <div class="modal-body">${modalCover('wifi', imageNames.coverWifi, 'WiFi & Internet', 'Stay connected throughout your stay')}
      <div class="modal-content"><div class="container">
        <div class="wifi-card">
          <div class="wifi-info">
            <div class="wifi-detail"><span class="wifi-label">Network</span><span class="wifi-value">${esc(d.wifiNetwork || '')}</span></div>
            <div class="wifi-detail"><span class="wifi-label">Password</span><span class="wifi-value wifi-password">${esc(d.wifiPassword || '')}</span></div>
            <div class="wifi-detail"><span class="wifi-label">Speed</span><span class="wifi-value">${esc(d.wifiSpeed || '')}</span></div>
          </div>
          <div class="qr-placeholder">
            <p class="qr-label">Scan to connect</p>
            ${imageNames.wifiQr
              ? `<div class="qr-box qr-box--filled"><img src="images/${imageNames.wifiQr}" alt="WiFi QR code"></div>`
              : `<div class="qr-box"><span>QR</span></div>`}
          </div>
        </div>
        <div class="card" style="margin-top:1rem;">
          <p class="card-label">Troubleshooting</p>
          <div class="accordion">
            <div class="accordion-item">
              <button class="accordion-toggle"><span>The WiFi seems slow</span><span class="accordion-icon"></span></button>
              <div class="accordion-body"><p>Try moving closer to the router. The router is located at <strong>${esc(d.wifiRouterLocation || '')}</strong>. Streaming and video calls work best within the same room.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-toggle"><span>I cannot connect to the network</span><span class="accordion-icon"></span></button>
              <div class="accordion-body"><p>Make sure you are selecting <strong>${esc(d.wifiNetwork || '')}</strong> and entering the password exactly as shown above. Passwords are case-sensitive.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-toggle"><span>The internet is not working at all</span><span class="accordion-icon"></span></button>
              <div class="accordion-body"><p>Unplug the router, wait 10 seconds, then plug it back in. Allow 1–2 minutes to reconnect. If the issue persists, contact us directly.</p></div>
            </div>
          </div>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: HOUSE RULES -->
  <div class="modal" id="modal-rules" role="dialog" aria-modal="true" aria-label="House Rules">${modalHeader('House Rules')}
    <div class="modal-body">${modalCover('rules', imageNames.coverRules, 'House Rules', 'Simple guidelines for a peaceful shared experience')}
      <div class="modal-content"><div class="container">
        <p class="section-note">We want every guest — and our neighbors — to have a wonderful experience. Thank you for respecting these guidelines.</p>
        <div class="rules-grid">
${(d.rules || []).map((r, i) => `          <div class="rule-card"><p class="rule-num">${String(i + 1).padStart(2, '0')}</p><h4>${esc(r.title || '')}</h4><p>${esc(r.text || '')}</p></div>`).join('\n')}
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: KITCHEN & DINING -->
  <div class="modal" id="modal-kitchen" role="dialog" aria-modal="true" aria-label="Kitchen and Dining">${modalHeader('Kitchen & Dining')}
    <div class="modal-body">${modalCover('kit', imageNames.coverKitchen, 'Kitchen & Dining', 'Cook, share, and gather around the table')}
      <div class="modal-content"><div class="container">
        <div class="two-col">
          <div class="card">
            <p class="card-label">Cooking Equipment</p>
            <ul class="simple-list">${li(d.kitchenEquipment || [])}</ul>
          </div>
          <div class="card">
            <p class="card-label">Storage &amp; Dining</p>
            <ul class="simple-list">${li(d.kitchenStorage || [])}</ul>
            <div class="divider"></div>
            <p class="card-sublabel">Notes</p>
            <ul class="simple-list">${li(d.kitchenNotes || [])}</ul>
          </div>
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: EXPLORE NEARBY -->
  <div class="modal" id="modal-nearby" role="dialog" aria-modal="true" aria-label="Explore Nearby">${modalHeader('Explore Nearby')}
    <div class="modal-body">${modalCover('near', imageNames.coverNearby, 'Explore Nearby', 'Discover what is just outside your door')}
      <div class="modal-content"><div class="container">
        <p class="nearby-section-title">Places to Visit</p>
        <div class="nearby-list">
${(d.nearby || []).map((n, i) => {
  const imgFile = (imageNames.nearbyImages && imageNames.nearbyImages[n.id]) || null;
  const reverse = i % 2 === 1 ? ' nearby-row--reverse' : '';
  const mapsUrl = buildMapsUrl(n, d);
  const embedUrl = buildMapEmbed(n, d);
  const useMap = !imgFile && n.showMap !== false && embedUrl;
  // Visual priority: manual photo > auto map > placeholder
  let photoBlock;
  if (imgFile) {
    photoBlock = `<div class="nearby-photo" style="background-image: url('images/${imgFile}')"></div>`;
  } else if (useMap) {
    photoBlock = `<div class="nearby-photo nearby-photo--map"><iframe src="${esc(embedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map of ${esc(n.name || 'location')}" allowfullscreen></iframe></div>`;
  } else {
    photoBlock = `<div class="nearby-photo nearby-photo--empty"><span>📷</span></div>`;
  }
  return `          <div class="nearby-row${reverse}">
            ${photoBlock}
            <div class="nearby-text">
              <h3 class="nearby-title">${n.emoji ? `<span class="nearby-emoji">${esc(n.emoji)}</span>` : ''}${esc(n.name || '')}${n.distance ? ` — <span class="nearby-distance">${esc(n.distance)}</span>` : ''}</h3>
              ${n.type ? `<p class="nearby-cat">${esc(n.type)}</p>` : ''}
              <p class="nearby-desc">${esc(n.description || '')}</p>
              ${mapsUrl ? `<a class="nearby-map-link" href="${esc(mapsUrl)}" target="_blank" rel="noopener noreferrer">${ICON_MAP_PIN}<span>View on Map</span></a>` : ''}
            </div>
          </div>`;
}).join('\n')}
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: EMERGENCY -->
  <div class="modal" id="modal-emergency" role="dialog" aria-modal="true" aria-label="Emergency">${modalHeader('Emergency')}
    <div class="modal-body">${modalCover('em', imageNames.coverEmergency, 'Emergency', 'Important contacts — we hope you never need them')}
      <div class="modal-content"><div class="container">
        <div class="emergency-banner">In a life-threatening emergency, call <strong>911</strong> immediately.</div>
        <div class="emergency-grid">
          <div class="emergency-card"><p class="card-label">Hospital</p><h3>${esc(d.emergencyHospital?.name || '')}</h3><p class="emergency-number">${esc(d.emergencyHospital?.phone || '')}</p><p class="emergency-address">${esc(d.emergencyHospital?.address || '')}</p></div>
          <div class="emergency-card"><p class="card-label">Police</p><h3>${esc(d.emergencyPolice?.name || '')}</h3><p class="emergency-number">${esc(d.emergencyPolice?.phone || '')}</p></div>
          <div class="emergency-card"><p class="card-label">Fire Department</p><h3>${esc(d.emergencyFire?.name || '')}</h3><p class="emergency-number">${esc(d.emergencyFire?.phone || '')}</p></div>
          <div class="emergency-card"><p class="card-label">Host — Emergency Line</p><h3>Contact us for anything at the property</h3><p class="emergency-number">${esc(d.emergencyHostPhone || '')}</p></div>
        </div>
        <div class="card" style="margin-top:1rem;"><p class="card-label">Fire Extinguisher</p><p style="color:var(--brown-mid);margin-top:0.5rem;font-size:0.9rem;">Located at: <strong>${esc(d.fireExtinguisherLocation || '')}</strong></p></div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: PET POLICY -->
  <div class="modal" id="modal-pets" role="dialog" aria-modal="true" aria-label="Pet Policy">${modalHeader('Pet Policy')}
    <div class="modal-body">${modalCover('pets', imageNames.coverPets, 'Pet Policy', d.petsAllowed === false ? 'Please review our policy below' : 'Well-behaved companions are welcome')}
      <div class="modal-content"><div class="container">
${d.petsAllowed === false ? `
        <div class="pet-status pet-status--no">
          <div class="pet-status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <p class="pet-status-label">No Pets Allowed</p>
        </div>
        <div class="card">
          <p class="card-label">Policy</p>
          <h3 style="margin-bottom:1rem;">${esc(d.petNotAllowedMessage || '')}</h3>
          <p style="color:var(--brown-mid); font-size:0.9rem; line-height:1.8; font-weight:300;">${esc(d.petNotAllowedReason || '')}</p>
        </div>` : `
        <div class="pet-status pet-status--yes">
          <div class="pet-status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p class="pet-status-label">Pets Welcome</p>
        </div>
        <div class="card">
          <p class="card-label">Policy</p>
          <h3 style="margin-bottom:1.5rem;">${esc(d.petPolicy || '')}</h3>
          ${d.petFee ? `<div class="pet-fee-row"><span class="pet-fee-label">Pet Cleaning Fee</span><span class="pet-fee-amount">${esc(d.petFee)}</span></div>` : ''}
          <div class="divider"></div>
          <p class="card-sublabel">Guidelines</p>
          <ul class="simple-list">${li(d.petGuidelines || [])}</ul>
        </div>`}
      </div></div>
    </div>
  </div>

  <!-- MODAL: GUEST REVIEWS -->
  <div class="modal" id="modal-reviews" role="dialog" aria-modal="true" aria-label="Guest Reviews">${modalHeader('Guest Reviews')}
    <div class="modal-body">${modalCover('rev', imageNames.coverReviews, 'Guest Reviews', 'Words from those who have stayed with us')}
      <div class="modal-content"><div class="container">
        <div class="reviews-grid">
${(d.reviews || []).map(r => `          <div class="review-card"><p class="review-stars">★★★★★</p><p class="review-text">"${esc(r.text || '')}"</p><p class="reviewer">— ${esc(r.author || '')} &nbsp;·&nbsp; ${esc(r.platform || '')}</p></div>`).join('\n')}
        </div>
      </div></div>
    </div>
  </div>

  <!-- MODAL: CONTACT -->
  <div class="modal" id="modal-contact" role="dialog" aria-modal="true" aria-label="Contact">${modalHeader('Contact')}
    <div class="modal-body">${modalCover('host', imageNames.coverContact, 'Contact Us', 'We are here to make your stay exceptional')}
      <div class="modal-content"><div class="container">
        <div class="host-card">
          <div class="host-photo-placeholder">${imageNames.hostPhoto ? `<img src="images/${imageNames.hostPhoto}" alt="${esc(d.hostName || 'Host')}">` : `<span>Photo</span>`}</div>
          <div class="host-info">
            <p class="card-label">Your Host</p>
            <h2>${esc(d.hostName || '')}</h2>
            <p class="host-quote">"${esc(d.hostQuote || '')}"</p>
            <p>${esc(d.hostBio || '')}</p>
            <div class="contact-info-list">
              ${d.phone ? `<a href="tel:${esc(d.phone)}" class="contact-info-row">
                <span class="contact-info-icon">${ICON_PHONE}</span>
                <span class="contact-info-value">${esc(d.phone)}</span>
              </a>` : ''}
              ${d.email ? `<a href="mailto:${esc(d.email)}" class="contact-info-row">
                <span class="contact-info-icon">${ICON_EMAIL}</span>
                <span class="contact-info-value">${esc(d.email)}</span>
              </a>` : ''}
            </div>
            ${(d.whatsappLink || d.airbnbLink) ? `<div class="contact-methods">
              ${d.whatsappLink ? `<a href="${esc(d.whatsappLink)}" target="_blank" rel="noopener noreferrer" class="contact-btn">WhatsApp</a>` : ''}
              ${d.airbnbLink ? `<a href="${esc(d.airbnbLink)}" target="_blank" rel="noopener noreferrer" class="contact-btn">Airbnb</a>` : ''}
            </div>` : ''}
            ${renderSocialLinks(d)}
            <div class="returning-guest">
              <p class="returning-title">Returning Guest Discount</p>
              <p>Book directly with us on your next visit for a special discount. Mention this guide when you reach out.</p>
            </div>
          </div>
        </div>
      </div></div>
    </div>
  </div>

${(d.customSections || []).filter(cs => cs.linkType !== 'external').map(cs => {
  const coverImg = (imageNames.customCovers && imageNames.customCovers[cs.id]) || null;
  return `
  <!-- MODAL: CUSTOM ${esc(cs.title || '')} -->
  <div class="modal" id="modal-custom-${esc(cs.id)}" role="dialog" aria-modal="true" aria-label="${esc(cs.title || '')}">${modalHeader(cs.title || 'Section')}
    <div class="modal-body">${modalCover(cs.id, coverImg, cs.title || '', cs.subtitle || '')}
      <div class="modal-content"><div class="container">
        <div class="card">
          <p class="card-label">${esc(cs.label || cs.title || 'Section')}</p>
          ${renderParagraphs(cs.content || '')}
        </div>
      </div></div>
    </div>
  </div>`;
}).join('\n')}

  <script src="js/main.js"></script>
</body>
</html>
`;
}
