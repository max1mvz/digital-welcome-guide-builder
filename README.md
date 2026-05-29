# Digital Welcome Guide Builder

A visual builder for creating custom **Digital Welcome Guides** for vacation rentals. Hosts fill in their property details, upload images, customize colors, and download a complete static website as a ZIP — ready to deploy to Netlify or Vercel.

## Features

- **Live Preview** — see changes in real-time as you type
- **15 Customizable Sections** — Property, Branding, Welcome, Accommodations, Check-in/Out, Amenities, WiFi, House Rules, Kitchen, Nearby Spots, Emergency, Pets, Reviews, Contact
- **Image Uploads** — logo, hero, and section covers
- **Color Themes** — 5 presets + full custom color picker
- **No Backend Required** — everything runs in your browser
- **One-Click Download** — exports a ZIP with HTML/CSS/JS/Images
- **Deploy Ready** — drop the ZIP onto Netlify or Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server (opens at http://localhost:5173)
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

The built site is in the `dist/` folder — deploy that to Vercel/Netlify if you want to host the **builder itself** online.

## Tech Stack

- **React 18** + **Vite** (frontend)
- **Tailwind CSS** (styling)
- **JSZip** (client-side ZIP generation)
- **file-saver** (download trigger)

## Project Structure

```
.
├── src/
│   ├── components/        # React UI components
│   │   ├── FormPanel.jsx       — Left-side form with all sections
│   │   ├── PreviewPane.jsx     — Right-side iframe live preview
│   │   ├── DownloadButton.jsx  — Generates & downloads ZIP
│   │   ├── ImageUpload.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── SectionAccordion.jsx
│   │   └── FormField.jsx
│   ├── templates/         # HTML/CSS/JS generators for the output guide
│   │   ├── htmlTemplate.js     — Produces final index.html
│   │   ├── cssTemplate.js      — Produces final style.css (with custom colors)
│   │   ├── jsTemplate.js       — Static main.js content
│   │   └── readmeTemplate.js
│   ├── utils/
│   │   ├── generateZip.js      — Bundles everything into ZIP
│   │   ├── livePreview.js      — Builds inline preview document
│   │   └── defaultData.js      — Initial form values
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## How It Works

1. User opens the builder and fills in form fields
2. As they type, the React state updates
3. The `PreviewPane` regenerates an HTML document (with inline CSS+JS) and pushes it to an iframe via `srcdoc`
4. When user clicks **Download**, `generateZip.js`:
   - Generates final `index.html` referencing real image filenames
   - Generates `style.css` with their custom colors
   - Bundles the static `main.js`
   - Adds all uploaded images to `images/`
   - Adds a `README.md` and `.claude/launch.json`
   - ZIPs it all and triggers a browser download

## Deploying the Generated Guide

After downloading the ZIP:

### Option A: Netlify Drop (easiest)
1. Extract the ZIP locally
2. Go to https://app.netlify.com/drop
3. Drag the extracted folder onto the page

### Option B: Vercel
```bash
cd ~/Downloads/your-guide
npx vercel --prod
```

### Option C: Local Preview
```bash
cd ~/Downloads/your-guide
npx serve -p 3000 .
```

## License

MIT
