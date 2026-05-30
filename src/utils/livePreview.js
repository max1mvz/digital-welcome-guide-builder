import { generateHTML } from '../templates/htmlTemplate.js';
import { generateCSS } from '../templates/cssTemplate.js';
import { jsContent } from '../templates/jsTemplate.js';

// Builds a single-document HTML string with inlined CSS+JS for the preview iframe.
// Image File objects are converted to object URLs so they appear immediately.
// `activeModalId` — when set, auto-opens that modal in the preview after load.
export function buildPreviewDocument(data, activeModalId = null) {
  // Map image keys -> blob URLs (kept on `previewUrls` so caller can revoke them)
  const previewUrls = {};
  const imageNames = { customCovers: {}, nearbyImages: {}, galleries: {}, videos: {} };

  for (const [key, file] of Object.entries(data.images || {})) {
    if (file instanceof File || file instanceof Blob) {
      const url = URL.createObjectURL(file);
      previewUrls[key] = url;
      // We'll replace the relative paths in HTML afterwards
      imageNames[key] = key; // placeholder marker
    }
  }

  // Custom section covers
  for (const cs of data.customSections || []) {
    if (cs.coverImage instanceof File || cs.coverImage instanceof Blob) {
      const url = URL.createObjectURL(cs.coverImage);
      const placeholderKey = `customCover_${cs.id}`;
      previewUrls[placeholderKey] = url;
      imageNames.customCovers[cs.id] = placeholderKey;
    }
  }

  // Nearby place images
  for (const n of data.nearby || []) {
    if (n.image instanceof File || n.image instanceof Blob) {
      const url = URL.createObjectURL(n.image);
      const placeholderKey = `nearbyImg_${n.id}`;
      previewUrls[placeholderKey] = url;
      imageNames.nearbyImages[n.id] = placeholderKey;
    }
  }

  // Custom section gallery images
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'gallery' && Array.isArray(cs.galleryImages) && cs.galleryImages.length) {
      imageNames.galleries[cs.id] = cs.galleryImages.map((file, idx) => {
        const placeholderKey = `gallery_${cs.id}_${idx}`;
        if (file instanceof File || file instanceof Blob) {
          previewUrls[placeholderKey] = URL.createObjectURL(file);
        }
        return placeholderKey;
      });
    }
  }

  // Custom section videos
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'video' && (cs.video instanceof File || cs.video instanceof Blob)) {
      const placeholderKey = `video_${cs.id}`;
      previewUrls[placeholderKey] = URL.createObjectURL(cs.video);
      imageNames.videos[cs.id] = placeholderKey;
    }
  }

  let html = generateHTML(data, imageNames);
  const css = generateCSS(data);

  // Replace placeholder image paths with blob URLs
  // The generated HTML references images like `images/logo.png` (via baseName from generateZip)
  // For preview we don't run generateZip, so the HTML references `images/<key>` (the placeholder).
  // Replace `images/<key>` everywhere with the blob URL.
  for (const [key, url] of Object.entries(previewUrls)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:images|videos)/${escaped}(?![a-zA-Z0-9])`, 'g');
    html = html.replace(regex, url);
  }

  // Inline the CSS and JS so the iframe is self-contained
  html = html.replace(
    '<link rel="stylesheet" href="css/style.css">',
    `<style>${css}</style>`
  );

  // Auto-open script — opens a specific modal on load
  const autoOpenScript = activeModalId
    ? `\n// Auto-open active modal (builder preview only)\nwindow.addEventListener('DOMContentLoaded', () => {\n  const m = document.getElementById(${JSON.stringify(activeModalId)});\n  if (m) {\n    m.classList.add('active');\n    document.body.style.overflow = 'hidden';\n  }\n});`
    : '';

  html = html.replace(
    '<script src="js/main.js"></script>',
    `<script>${jsContent}${autoOpenScript}</script>`
  );

  return { html, previewUrls };
}
