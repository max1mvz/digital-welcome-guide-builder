// Generates style.css with custom user colors injected via CSS variables.
// Lighten / darken helpers produce derived shades.

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('');
}

function lighten(hex, amount = 0.1) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex, amount = 0.1) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

export function generateCSS(d) {
  const cream = d.colorPrimary || '#F0EDE8';
  const accent = d.colorAccent || '#3A2415';
  const mid = d.colorMid || '#7A6555';

  const creamLight = lighten(cream, 0.4);
  const creamDark = darken(cream, 0.06);
  const accentDark = darken(accent, 0.2);
  const midLight = lighten(mid, 0.25);
  const border = darken(cream, 0.08);

  // Hero card appearance
  const heroCardStyle = d.heroCardStyle || 'frosted';
  const heroCardColor = d.heroCardColor || '#2A1A0E';
  const heroCardOpacity = (typeof d.heroCardOpacity === 'number') ? d.heroCardOpacity : 0.72;
  const heroCardBlur = (typeof d.heroCardBlur === 'number') ? d.heroCardBlur : 18;
  const heroOverlayOpacity = (typeof d.heroOverlayOpacity === 'number') ? d.heroOverlayOpacity : 0.48;
  const { r: hr, g: hg, b: hb } = hexToRgb(heroCardColor);

  // Fonts
  const fontDisplay = d.fontDisplay || 'Cormorant Garamond';
  const fontBody = d.fontBody || 'Jost';

  let heroCardBackground;
  let heroCardBackdrop;
  if (heroCardStyle === 'solid') {
    heroCardBackground = heroCardColor;
    heroCardBackdrop = 'none';
  } else if (heroCardStyle === 'transparent') {
    heroCardBackground = `rgba(${hr}, ${hg}, ${hb}, ${heroCardOpacity})`;
    heroCardBackdrop = 'none';
  } else {
    // frosted (default)
    heroCardBackground = `rgba(${hr}, ${hg}, ${hb}, ${heroCardOpacity})`;
    heroCardBackdrop = `blur(${heroCardBlur}px)`;
  }

  return `/* =====================
   DESIGN TOKENS
   ===================== */
:root {
  --cream:        ${cream};
  --cream-light:  ${creamLight};
  --cream-dark:   ${creamDark};
  --brown-deep:   ${accent};
  --brown-dark:   ${accentDark};
  --brown-mid:    ${mid};
  --brown-light:  ${midLight};
  --white:        #FFFFFF;
  --border:       ${border};

  --font-display: '${fontDisplay}', Georgia, serif;
  --font-body:    '${fontBody}', 'Helvetica Neue', Arial, sans-serif;

  --nav-height:    68px;
  --section-pad:   3.5rem 0;
  --container-max: 780px;
  --radius:        4px;
  --card-shadow:   0 1px 12px rgba(42, 26, 14, 0.06);
}

/* RESET & BASE */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--brown-dark);
  line-height: 1.75;
  font-weight: 300;
}
img { max-width: 100%; height: auto; display: block; }
strong { font-weight: 500; }

/* HERO */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--brown-deep);
  background-size: cover;
  background-position: center;
}
.hero-overlay { position: absolute; inset: 0; background: rgba(22, 12, 4, ${heroOverlayOpacity}); }
.hero-card {
  position: relative; z-index: 2;
  background: ${heroCardBackground};
  ${heroCardBackdrop !== 'none' ? `backdrop-filter: ${heroCardBackdrop}; -webkit-backdrop-filter: ${heroCardBackdrop};` : ''}
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem 2rem 2.25rem;
  width: 90%; max-width: 380px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.hero-logo { width: auto; max-width: 220px; max-height: 140px; object-fit: contain; margin-bottom: 1.75rem; }
.hero-name {
  font-family: var(--font-display);
  color: #fff;
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 1.75rem;
}
.hero-tagline {
  font-family: var(--font-display);
  font-style: italic;
  color: rgba(255,255,255,0.72);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  margin-bottom: 1.75rem;
}
/* Tighten the gap between the logo/name and the tagline when both are present */
.hero-logo:has(+ .hero-tagline),
.hero-name:has(+ .hero-tagline) { margin-bottom: 0.5rem; }
.hero-info-list { width: 100%; display: flex; flex-direction: column; gap: 0.625rem; margin-bottom: 2rem; }
.hero-info-row {
  display: flex; align-items: center; gap: 0.875rem;
  background: rgba(255,255,255,0.09);
  border-radius: 12px; padding: 0.75rem 1rem;
  font-family: var(--font-body); font-size: 0.875rem; font-weight: 300;
  color: rgba(255,255,255,0.82); letter-spacing: 0.02em; text-align: left;
}
.hero-info-icon {
  flex-shrink: 0; width: 30px; height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.75);
}
.hero-info-row--link {
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.hero-info-row--link:hover {
  background: rgba(255,255,255,0.16);
  transform: translateY(-1px);
}
.hero-info-go {
  margin-left: auto;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
}
.hero-cta-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.625rem; }
.hero-click-btn {
  background: var(--white); color: var(--brown-dark);
  border: none; cursor: pointer;
  font-family: var(--font-body); font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.22em; text-transform: uppercase;
  padding: 0.8rem 2.75rem; border-radius: 50px;
  animation: pulse-glow 2.2s ease-in-out infinite;
  transition: transform 0.2s ease, background 0.2s ease;
}
.hero-click-btn:hover { transform: scale(1.05); background: var(--cream); }
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
  50%       { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
}
.hero-arrow-wrap { color: rgba(255,255,255,0.55); animation: bounce-down 1.5s ease-in-out infinite; }
@keyframes bounce-down {
  0%, 100% { transform: translateY(0);   opacity: 0.55; }
  50%       { transform: translateY(6px); opacity: 1;    }
}

/* GUIDE GRID */
.guide-index { background: var(--cream-light); padding: 3.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.guide-index-label {
  text-align: center; font-family: var(--font-body);
  font-size: 0.65rem; font-weight: 500; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--brown-light); margin-bottom: 2rem;
}
.guide-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.guide-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.875rem; background: var(--white); border: 1px solid var(--border);
  border-radius: 10px; padding: 2rem 1rem 1.75rem;
  text-decoration: none; color: var(--brown-dark);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
  cursor: pointer; width: 100%; appearance: none; -webkit-appearance: none;
}
.guide-card:hover {
  border-color: var(--brown-mid);
  box-shadow: 0 4px 20px rgba(42, 26, 14, 0.09);
  transform: translateY(-2px);
}
.guide-icon { width: 26px; height: 26px; color: var(--brown-mid); flex-shrink: 0; }
.guide-card span {
  font-family: var(--font-body); font-size: 0.72rem; font-weight: 400;
  letter-spacing: 0.06em; color: var(--brown-dark); text-align: center; line-height: 1.4;
}
.guide-card-ext {
  font-size: 0.7rem;
  color: var(--brown-light);
  margin-left: 0.25rem;
  vertical-align: super;
  letter-spacing: 0;
}
@media (max-width: 580px) {
  .guide-grid { gap: 0.5rem; }
  .guide-card { padding: 1.375rem 0.5rem; gap: 0.625rem; border-radius: 8px; }
  .guide-icon { width: 22px; height: 22px; }
  .guide-card span { font-size: 0.65rem; }
}

/* MODAL COVERS */
.cover-overlay { position: absolute; inset: 0; background: rgba(22, 12, 4, 0.65); }
.cover-content {
  position: relative; z-index: 1; display: flex; flex-direction: column;
  align-items: center; gap: 1.1rem; max-width: 560px; padding: 0 1.75rem; width: 100%;
}
.cover-line { width: 36px; height: 1px; background: rgba(255,255,255,0.35); }
.cover-title {
  font-family: var(--font-display); font-size: clamp(1.6rem, 5vw, 2.6rem); font-weight: 300;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--white); line-height: 1.2;
}
.cover-subtitle {
  font-family: var(--font-display); font-size: 1rem; font-style: italic; font-weight: 300;
  color: rgba(255,255,255,0.6); letter-spacing: 0.03em; line-height: 1.6;
}

/* SECTION BODY */
.section-body { background: var(--cream); padding: var(--section-pad); }
.container { max-width: var(--container-max); margin: 0 auto; padding: 0 1.75rem; }

/* CARDS */
.card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 2rem 2.25rem; box-shadow: var(--card-shadow); margin-bottom: 1rem;
}
.card-label, .card-sublabel {
  font-family: var(--font-body); font-size: 0.65rem; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--brown-light); margin-bottom: 0.875rem;
}
.card-sublabel { margin-bottom: 0.625rem; }
.card h3 {
  font-family: var(--font-display); font-size: 1.35rem; font-weight: 400;
  color: var(--brown-dark); line-height: 1.5;
}
.divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* DETAIL LIST */
.detail-list { list-style: none; padding: 0; margin-top: 1rem; }
.detail-list li {
  display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;
  padding: 0.6rem 0; border-bottom: 1px solid var(--cream-dark);
  font-size: 0.9rem; color: var(--brown-mid);
}
.detail-list li:last-child { border-bottom: none; }
.detail-label { font-weight: 400; color: var(--brown-dark); flex-shrink: 0; font-size: 0.875rem; }

/* TIME BLOCK */
.time-block { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 0.5rem; }
.time-value {
  font-family: var(--font-display); font-size: 3rem; font-weight: 300;
  color: var(--brown-dark); letter-spacing: 0.04em; line-height: 1;
}
.time-note { font-size: 0.875rem; color: var(--brown-mid); font-weight: 300; }

/* STEP LIST */
.step-list { list-style: none; padding: 0; counter-reset: steps; }
.step-list li {
  counter-increment: steps; display: flex; align-items: flex-start; gap: 0.875rem;
  padding: 0.55rem 0; border-bottom: 1px solid var(--cream-dark);
  font-size: 0.875rem; color: var(--brown-mid);
}
.step-list li:last-child { border-bottom: none; }
.step-list li::before {
  content: counter(steps, decimal-leading-zero); flex-shrink: 0;
  font-family: var(--font-display); font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.05em; color: var(--brown-light);
  padding-top: 0.15rem; min-width: 1.5rem;
}

/* CHECK LIST */
.check-list { list-style: none; padding: 0; }
.check-list li {
  position: relative; padding: 0.55rem 0 0.55rem 1.25rem;
  border-bottom: 1px solid var(--cream-dark);
  font-size: 0.875rem; color: var(--brown-mid);
}
.check-list li:last-child { border-bottom: none; }
.check-list li::before { content: '—'; position: absolute; left: 0; color: var(--brown-light); font-size: 0.8rem; }

/* AMENITIES */
.amenity-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.amenity-category {
  background: var(--white); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--card-shadow); overflow: hidden;
}
.amenity-body { padding: 1.625rem; }
.amenity-photo {
  height: 130px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: 1px solid var(--border);
}
.amenity-category--photo .amenity-body { padding-top: 1.25rem; }
.amenity-category ul { list-style: none; padding: 0; margin-top: 0.875rem; }
.amenity-category li {
  font-size: 0.875rem; color: var(--brown-mid);
  padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark); font-weight: 300;
}
.amenity-category li:last-child { border-bottom: none; }

/* WIFI */
.wifi-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 2rem 2.25rem; box-shadow: var(--card-shadow);
  display: flex; gap: 2.5rem; align-items: center;
}
.wifi-info { flex: 1; }
.wifi-detail { display: flex; flex-direction: column; margin-bottom: 1.375rem; }
.wifi-detail:last-child { margin-bottom: 0; }
.wifi-label {
  font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--brown-light); margin-bottom: 0.25rem;
}
.wifi-value { font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; color: var(--brown-dark); }
.wifi-password {
  font-family: 'Courier New', monospace; font-size: 1.1rem;
  background: var(--cream); border: 1px solid var(--border);
  padding: 0.5rem 0.875rem; border-radius: var(--radius);
  letter-spacing: 0.1em; color: var(--brown-dark); font-weight: 400;
}
.qr-placeholder { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.qr-label { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--brown-light); }
.qr-box {
  width: 120px; height: 120px; border: 1px solid var(--border); border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  color: var(--brown-light); font-family: var(--font-display);
  font-size: 1.1rem; letter-spacing: 0.1em; background: var(--cream);
  overflow: hidden;
}
.qr-box--filled {
  background: var(--white);
  padding: 6px;
}
.qr-box--filled img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* ACCORDION */
.accordion { margin-top: 0.875rem; }
.accordion-item { border-bottom: 1px solid var(--border); }
.accordion-item:first-child { border-top: 1px solid var(--border); }
.accordion-toggle {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; background: none; border: none; cursor: pointer;
  padding: 1rem 0; text-align: left;
  font-family: var(--font-body); font-size: 0.9rem; font-weight: 400;
  color: var(--brown-dark); letter-spacing: 0.01em; transition: color 0.2s;
}
.accordion-toggle:hover { color: var(--brown-mid); }
.accordion-icon { position: relative; flex-shrink: 0; width: 14px; height: 14px; }
.accordion-icon::before, .accordion-icon::after {
  content: ''; position: absolute; background: var(--brown-light); border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.accordion-icon::before { width: 14px; height: 1px; top: 50%; left: 0; transform: translateY(-50%); }
.accordion-icon::after { width: 1px; height: 14px; top: 0; left: 50%; transform: translateX(-50%); }
.accordion-item.open .accordion-icon::after { opacity: 0; transform: translateX(-50%) rotate(90deg); }
.accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; }
.accordion-body.open { max-height: 400px; }
.accordion-body p { font-size: 0.875rem; color: var(--brown-mid); font-weight: 300; line-height: 1.75; padding-bottom: 1rem; }

/* RULES */
.section-note {
  text-align: center; font-size: 0.95rem; color: var(--brown-mid); margin-bottom: 2.25rem;
  font-style: italic; font-family: var(--font-display);
  max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.8;
}
.rules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.rule-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.625rem; box-shadow: var(--card-shadow);
}
.rule-num {
  font-family: var(--font-display); font-size: 0.85rem; font-weight: 300;
  letter-spacing: 0.1em; color: var(--brown-light); margin-bottom: 0.625rem;
}
.rule-card h4 {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 500;
  color: var(--brown-dark); margin-bottom: 0.5rem; letter-spacing: 0.02em;
}
.rule-card p { font-size: 0.875rem; color: var(--brown-mid); line-height: 1.7; font-weight: 300; }

/* KITCHEN */
.simple-list { list-style: none; padding: 0; margin-top: 0.875rem; }
.simple-list li {
  font-size: 0.875rem; color: var(--brown-mid); padding: 0.4rem 0;
  border-bottom: 1px solid var(--cream-dark); font-weight: 300;
}
.simple-list li:last-child { border-bottom: none; }

/* NEARBY — alternating photo + text rows */
.nearby-section-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--brown-dark);
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
  border-bottom: 2px solid var(--brown-mid);
  padding-bottom: 0.5rem;
  display: inline-block;
}
.nearby-list { display: flex; flex-direction: column; gap: 1.5rem; }
.nearby-row {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 1.25rem;
  align-items: stretch;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.nearby-row:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(42,26,14,0.10); }
.nearby-row--reverse { grid-template-columns: 1.1fr 1fr; }
.nearby-row--reverse .nearby-photo { order: 2; }
.nearby-row--reverse .nearby-text { order: 1; }
.nearby-photo {
  min-height: 180px;
  background-color: var(--cream);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.nearby-photo--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  opacity: 0.3;
  background: linear-gradient(135deg, var(--cream-dark), var(--cream));
}
.nearby-photo--map { padding: 0; background: var(--cream-dark); }
.nearby-photo--map iframe {
  width: 100%;
  height: 100%;
  min-height: 180px;
  border: 0;
  display: block;
}
.nearby-text {
  padding: 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nearby-cat {
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brown-light);
  margin-bottom: 0.5rem;
}
.nearby-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brown-dark);
  line-height: 1.3;
  margin-bottom: 0.625rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.nearby-emoji {
  font-size: 1.4rem;
  line-height: 1;
}
.nearby-distance {
  color: var(--brown-mid);
  font-weight: 400;
  font-style: italic;
  font-size: 0.95rem;
}
.nearby-desc {
  font-size: 0.875rem;
  color: var(--brown-mid);
  line-height: 1.7;
  font-weight: 300;
}
.nearby-map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.875rem;
  padding: 0.45rem 0.9rem;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brown-dark);
  text-decoration: none;
  width: fit-content;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}
.nearby-map-link:hover {
  background: var(--brown-dark);
  border-color: var(--brown-dark);
  color: var(--white);
  transform: translateY(-1px);
}
.nearby-map-link svg { flex-shrink: 0; }

/* EMERGENCY */
.emergency-banner {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1rem 1.5rem; margin-bottom: 1.25rem;
  font-size: 0.9rem; color: var(--brown-dark); text-align: center; font-weight: 300; letter-spacing: 0.02em;
}
.emergency-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.emergency-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.625rem; box-shadow: var(--card-shadow);
}
.emergency-card h3 {
  font-family: var(--font-display); font-size: 1.05rem; font-weight: 400;
  color: var(--brown-dark); margin: 0.5rem 0 0.375rem; line-height: 1.4;
}
.emergency-card p { font-size: 0.875rem; color: var(--brown-mid); margin-bottom: 0.2rem; font-weight: 300; }
.emergency-number {
  font-family: var(--font-display); font-size: 1.35rem !important; font-weight: 500 !important;
  color: var(--brown-dark) !important; letter-spacing: 0.03em; margin-top: 0.25rem !important;
}
.emergency-address { font-size: 0.8rem !important; font-style: italic; }

/* PETS */
.pet-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--card-shadow);
}
.pet-status-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pet-status--yes .pet-status-icon {
  background: rgba(76, 175, 80, 0.12);
  color: #2E7D32;
}
.pet-status--no .pet-status-icon {
  background: rgba(229, 57, 53, 0.10);
  color: #C62828;
}
.pet-status-label {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--brown-dark);
}
.pet-fee-row {
  display: flex; justify-content: space-between; align-items: center;
  background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.875rem 1.25rem; margin: 1rem 0;
}
.pet-fee-label {
  font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--brown-mid); font-weight: 400;
}
.pet-fee-amount { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; color: var(--brown-dark); }

/* REVIEWS */
.reviews-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.review-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 2rem 2.25rem; box-shadow: var(--card-shadow);
}
.review-stars { font-size: 0.7rem; letter-spacing: 0.2em; color: var(--brown-mid); margin-bottom: 1rem; }
.review-text {
  font-family: var(--font-display); font-size: 1.15rem; font-style: italic; font-weight: 300;
  color: var(--brown-dark); line-height: 1.85; margin-bottom: 1.25rem;
}
.reviewer {
  font-size: 0.72rem; font-weight: 400; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--brown-light);
}

/* HOST / CONTACT */
.host-card {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 2.25rem; box-shadow: var(--card-shadow);
  display: flex; gap: 2.5rem; align-items: flex-start;
}
.host-photo-placeholder {
  flex-shrink: 0; width: 110px; height: 110px; border-radius: 50%;
  background: var(--cream); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--brown-light); overflow: hidden;
}
.host-photo-placeholder img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.host-info h2 {
  font-family: var(--font-display); font-size: 1.75rem; font-weight: 400;
  color: var(--brown-dark); margin: 0.625rem 0 0.375rem; letter-spacing: 0.03em;
}
.host-quote {
  font-family: var(--font-display); font-size: 1rem; font-style: italic;
  color: var(--brown-mid); margin-bottom: 0.875rem; line-height: 1.7; font-weight: 300;
}
.host-info > p:not(.card-label):not(.host-quote) {
  font-size: 0.875rem; color: var(--brown-mid); margin-bottom: 1.5rem; line-height: 1.8; font-weight: 300;
}
/* Contact info rows — same style as hero phone/email */
.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.contact-info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--brown-dark);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.contact-info-row:hover {
  background: var(--white);
  border-color: var(--brown-mid);
  transform: translateY(-1px);
}
.contact-info-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--white);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brown-mid);
}
.contact-info-value {
  flex: 1;
  word-break: break-word;
}

.contact-methods { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.contact-btn {
  display: inline-block; font-family: var(--font-body); font-size: 0.7rem; font-weight: 400;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--brown-dark);
  text-decoration: none; border: 1px solid var(--border);
  padding: 0.575rem 1.25rem; border-radius: var(--radius);
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.contact-btn:hover { background: var(--brown-dark); border-color: var(--brown-dark); color: var(--white); }
/* SOCIAL LINKS */
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.social-link {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--brown-dark);
  text-decoration: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
}
.social-link:hover {
  background: var(--brown-dark);
  border-color: var(--brown-dark);
  color: var(--white);
  transform: translateY(-2px);
}
.footer-socials {
  justify-content: center;
  margin: 1.25rem 0 0.75rem;
}
.social-link--footer {
  border-color: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.75);
}
.social-link--footer:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.4);
  color: var(--white);
}

.returning-guest { border-top: 1px solid var(--border); padding-top: 1.25rem; }
.returning-title {
  font-family: var(--font-display); font-size: 1rem; font-weight: 500;
  color: var(--brown-dark); margin-bottom: 0.375rem;
}
.returning-guest p:not(.returning-title) {
  font-size: 0.875rem; color: var(--brown-mid); font-weight: 300; line-height: 1.7;
}

/* GALLERY (custom section) */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
.gallery-item {
  display: block;
  aspect-ratio: 1 / 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--cream-dark);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.gallery-item:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 18px rgba(42, 26, 14, 0.18);
}
@media (max-width: 580px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}

/* LIGHTBOX / CAROUSEL */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1300;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}
.lightbox.active { opacity: 1; visibility: visible; }
.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.55);
  user-select: none;
  -webkit-user-drag: none;
}
.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.4rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lightbox-close:hover { opacity: 1; }
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.lightbox-nav:hover { background: rgba(255, 255, 255, 0.25); }
.lightbox-prev { left: 1rem; }
.lightbox-next { right: 1rem; }
.lightbox-counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--font-body);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
}
@media (max-width: 580px) {
  .lightbox-img { max-width: 94vw; max-height: 80vh; }
  .lightbox-nav { width: 40px; height: 40px; font-size: 1.5rem; }
  .lightbox-prev { left: 0.5rem; }
  .lightbox-next { right: 0.5rem; }
  .lightbox-close { top: 0.5rem; right: 0.85rem; font-size: 2rem; }
}

/* FLOATING VIDEO PLAYER (transparent backdrop) */
.video-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1350;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}
.video-lightbox.active { opacity: 1; visibility: visible; }
.video-player {
  max-width: 88vw;
  max-height: 82vh;
  width: auto;
  border-radius: 10px;
  background: #000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  outline: none;
}
.video-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  color: #fff;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.video-close:hover { background: rgba(0, 0, 0, 0.8); }
@media (max-width: 580px) {
  .video-player { max-width: 94vw; max-height: 78vh; }
  .video-close { top: 0.5rem; right: 0.75rem; width: 38px; height: 38px; font-size: 1.6rem; }
}

/* MODAL SYSTEM */
.modal {
  position: fixed; inset: 0; z-index: 1100;
  background: rgba(22, 12, 4, 0.50);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 1.25rem 1rem;
  opacity: 0; visibility: hidden;
  transition: opacity 0.28s ease, visibility 0.28s ease;
  cursor: pointer;
}
.modal.active { opacity: 1; visibility: visible; }
.modal-header {
  width: 100%; max-width: 580px; height: 54px;
  background: var(--brown-deep);
  border-radius: 14px 14px 0 0;
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: center; padding: 0 1rem;
  flex-shrink: 0;
  transform: translateY(12px) scale(0.97);
  transition: transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
  cursor: default;
}
.modal.active .modal-header { transform: translateY(0) scale(1); }
.modal-back {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.75);
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.25rem;
  font-family: var(--font-body); font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  transition: color 0.2s; justify-self: start;
}
.modal-back:hover { color: var(--white); }
.modal-back svg { flex-shrink: 0; }
.modal-title {
  color: rgba(255,255,255,0.9);
  font-family: var(--font-body); font-size: 0.72rem; font-weight: 400;
  letter-spacing: 0.18em; text-transform: uppercase;
  text-align: center; justify-self: center;
}
.modal-body {
  width: 100%; max-width: 580px;
  max-height: calc(85vh - 54px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background: var(--cream);
  border-radius: 0 0 14px 14px;
  transform: translateY(12px) scale(0.97);
  transition: transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
  cursor: default;
}
.modal.active .modal-body { transform: translateY(0) scale(1); }
.modal-cover {
  position: relative; min-height: 210px; max-height: 240px;
  display: flex; align-items: center; justify-content: center;
  background-color: var(--brown-deep);
  background-size: cover; background-position: center; background-repeat: no-repeat;
  overflow: hidden;
}
.modal-content { background: var(--cream); padding: 2rem 0 1.5rem; }

/* FOOTER */
footer { background: var(--brown-deep); color: rgba(255,255,255,0.5); text-align: center; padding: 3.5rem 1.75rem; }
.footer-logo {
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 300;
  letter-spacing: 0.1em; color: rgba(255,255,255,0.85); margin-bottom: 0.625rem;
}
footer p { font-size: 0.8rem; font-weight: 300; letter-spacing: 0.06em; margin-bottom: 0.375rem; }
.footer-copy { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 1.25rem; letter-spacing: 0.08em; }

/* SCROLL ANIMATIONS */
.fade-in { opacity: 0; transform: translateY(14px); transition: opacity 0.65s ease, transform 0.65s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* RESPONSIVE */
@media (max-width: 720px) { .two-col { grid-template-columns: 1fr; } }
@media (max-width: 580px) {
  :root { --section-pad: 2.5rem 0; }
  .amenity-grid, .rules-grid, .emergency-grid { grid-template-columns: 1fr; }
  .nearby-row, .nearby-row--reverse {
    grid-template-columns: 1fr;
  }
  .nearby-row--reverse .nearby-photo { order: 0; }
  .nearby-row--reverse .nearby-text { order: 0; }
  .nearby-photo { min-height: 200px; }
  .wifi-card { flex-direction: column; align-items: flex-start; }
  .qr-placeholder { align-self: center; }
  .host-card { flex-direction: column; align-items: center; text-align: center; }
  .contact-methods { justify-content: center; }
  .detail-list li { flex-direction: column; gap: 0.1rem; }
}
`;
}
