import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateHTML } from '../templates/htmlTemplate.js';
import { generateCSS } from '../templates/cssTemplate.js';
import { jsContent } from '../templates/jsTemplate.js';
import { generateReadme } from '../templates/readmeTemplate.js';

// Map of state keys -> filename in the images/ folder
const IMAGE_FILENAMES = {
  logo: 'logo',
  hero: 'hero',
  coverWelcome: 'cover-welcome',
  coverAccommodations: 'cover-accommodations',
  coverCheckin: 'cover-checkin',
  coverAmenities: 'cover-amenities',
  coverWifi: 'cover-wifi',
  coverRules: 'cover-rules',
  coverKitchen: 'cover-kitchen',
  coverNearby: 'cover-nearby',
  coverEmergency: 'cover-emergency',
  coverPets: 'cover-pets',
  coverReviews: 'cover-reviews',
  coverContact: 'cover-host',
  wifiQr: 'wifi-qr',
  hostPhoto: 'host-photo',
  amenitySleepingImg: 'amenity-sleeping',
  amenityBathroomImg: 'amenity-bathroom',
  amenityLivingImg: 'amenity-living',
  amenityWorkspaceImg: 'amenity-workspace',
  amenityKitchenImg: 'amenity-kitchen',
  amenityOutdoorImg: 'amenity-outdoor'
};

function fileExtension(file) {
  if (!file) return '';
  const name = file.name || '';
  const m = name.match(/\.([a-zA-Z0-9]+)$/);
  if (m) return '.' + m[1].toLowerCase();
  // Fallback by MIME type
  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/jpeg') return '.jpg';
  if (file.type === 'image/webp') return '.webp';
  if (file.type === 'video/mp4') return '.mp4';
  if (file.type === 'video/webm') return '.webm';
  if (file.type === 'video/quicktime') return '.mov';
  if (file.type && file.type.startsWith('video/')) return '.mp4';
  return '.jpg';
}

export async function generateGuideZip(data) {
  const zip = new JSZip();

  // Build map of imageKey -> actual filename ("logo.png", etc.)
  const imageNames = { customCovers: {}, nearbyImages: {}, galleries: {}, videos: {} };
  for (const [key, baseName] of Object.entries(IMAGE_FILENAMES)) {
    const file = data.images?.[key];
    if (file) {
      imageNames[key] = baseName + fileExtension(file);
    }
  }
  // Custom section cover images
  for (const cs of data.customSections || []) {
    const file = cs.coverImage;
    if (file) {
      imageNames.customCovers[cs.id] = `cover-custom-${cs.id}${fileExtension(file)}`;
    }
  }
  // Nearby place images
  for (const n of data.nearby || []) {
    if (n.image) {
      imageNames.nearbyImages[n.id] = `nearby-${n.id}${fileExtension(n.image)}`;
    }
  }
  // Custom section gallery images
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'gallery' && Array.isArray(cs.galleryImages) && cs.galleryImages.length) {
      imageNames.galleries[cs.id] = cs.galleryImages.map((file, idx) => `gallery-${cs.id}-${idx}${fileExtension(file)}`);
    }
  }
  // Custom section videos
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'video' && cs.video) {
      imageNames.videos[cs.id] = `video-${cs.id}${fileExtension(cs.video)}`;
    }
  }

  // Generate text files
  const html = generateHTML(data, imageNames);
  const css = generateCSS(data);
  const readme = generateReadme(data);

  zip.file('index.html', html);
  zip.folder('css').file('style.css', css);
  zip.folder('js').file('main.js', jsContent);
  zip.file('README.md', readme);

  // Add images
  const imagesFolder = zip.folder('images');
  for (const [key, baseName] of Object.entries(IMAGE_FILENAMES)) {
    const file = data.images?.[key];
    if (file) {
      const filename = baseName + fileExtension(file);
      const buffer = await file.arrayBuffer();
      imagesFolder.file(filename, buffer);
    }
  }
  // Custom section cover images
  for (const cs of data.customSections || []) {
    if (cs.coverImage) {
      const filename = `cover-custom-${cs.id}${fileExtension(cs.coverImage)}`;
      const buffer = await cs.coverImage.arrayBuffer();
      imagesFolder.file(filename, buffer);
    }
  }
  // Nearby place images
  for (const n of data.nearby || []) {
    if (n.image) {
      const filename = `nearby-${n.id}${fileExtension(n.image)}`;
      const buffer = await n.image.arrayBuffer();
      imagesFolder.file(filename, buffer);
    }
  }
  // Custom section gallery images
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'gallery' && Array.isArray(cs.galleryImages)) {
      for (let idx = 0; idx < cs.galleryImages.length; idx++) {
        const file = cs.galleryImages[idx];
        if (!file) continue;
        const filename = `gallery-${cs.id}-${idx}${fileExtension(file)}`;
        const buffer = await file.arrayBuffer();
        imagesFolder.file(filename, buffer);
      }
    }
  }

  // Custom section videos (in a dedicated videos/ folder, created only if needed)
  let videosFolder = null;
  for (const cs of data.customSections || []) {
    if (cs.linkType === 'video' && cs.video) {
      if (!videosFolder) videosFolder = zip.folder('videos');
      const filename = `video-${cs.id}${fileExtension(cs.video)}`;
      const buffer = await cs.video.arrayBuffer();
      videosFolder.file(filename, buffer);
    }
  }

  // .claude/launch.json for local-preview convenience
  const launchJson = JSON.stringify({
    version: '0.0.1',
    configurations: [
      {
        name: (data.propertyName || 'Welcome Guide') + ' Preview',
        runtimeExecutable: 'npx',
        runtimeArgs: ['serve', '-p', '3000', '.'],
        port: 3000
      }
    ]
  }, null, 2);
  zip.folder('.claude').file('launch.json', launchJson);

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const safeName = (data.propertyName || 'welcome-guide').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  saveAs(blob, `${safeName}-guide.zip`);
}
