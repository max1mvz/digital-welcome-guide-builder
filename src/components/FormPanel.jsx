import React from 'react';
import SectionAccordion from './SectionAccordion.jsx';
import ImageUpload from './ImageUpload.jsx';
import IconPicker from './IconPicker.jsx';
import FontPicker, { DISPLAY_FONTS, BODY_FONTS } from './FontPicker.jsx';
import { TextField, TextArea, StringListEditor, ColorField } from './FormField.jsx';

// Small SVG icons for social inputs
const SOCIAL_SVGS = {
  facebook:  '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="2.5"/>',
  tiktok:    '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  twitter:   '<path d="M4 4l8 10L4 22h2l7-8 6 8h5l-9-11 8-9h-2l-7 8-6-8H4z"/>',
  youtube:   '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
  pinterest: '<circle cx="12" cy="12" r="10"/><path d="M8 11.5a4 4 0 1 1 6.7 2.94c-.65.69-2.06.94-3 1.94-.4.43-.7 1.62-.7 1.62"/><line x1="12" y1="17" x2="11" y2="22"/>',
  linkedin:  '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'
};

function SocialInput({ icon, label, value, onChange, placeholder }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="w-9 h-9 rounded-md border border-border bg-white flex items-center justify-center text-brown-dark flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"
          dangerouslySetInnerHTML={{ __html: SOCIAL_SVGS[icon] }} />
      </div>
      <input
        type="url"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="flex-1 px-3 py-2 text-sm border border-border rounded bg-white text-brown-dark placeholder:text-brown-light/60 focus:border-brown-deep focus:outline-none"
      />
    </div>
  );
}

// Predefined color presets
const COLOR_PRESETS = [
  { name: 'Casa Nosa', primary: '#F0EDE8', accent: '#3A2415', mid: '#7A6555' },
  { name: 'Coastal',   primary: '#EAF4F4', accent: '#1B4965', mid: '#5C8DAA' },
  { name: 'Forest',    primary: '#EFF1ED', accent: '#2D4739', mid: '#6E8470' },
  { name: 'Sunset',    primary: '#FFF5EB', accent: '#7B341E', mid: '#C05621' },
  { name: 'Mono',      primary: '#F5F5F5', accent: '#1A1A1A', mid: '#666666' }
];

export default function FormPanel({ data, update, updateImage, activeModalId, setActiveModalId }) {
  const applyPreset = (preset) => {
    update('colorPrimary', preset.primary);
    update('colorAccent', preset.accent);
    update('colorMid', preset.mid);
  };

  // Helper to wire up an accordion section to the preview modal
  const previewProps = (modalId) => ({
    modalId,
    onOpenChange: (isOpen, mid) => {
      if (isOpen) setActiveModalId(mid || null);
      else if (activeModalId === mid) setActiveModalId(null);
    }
  });

  // Helper to toggle a default section's visibility
  const enabledProps = (key) => ({
    enabled: data.enabledSections?.[key] !== false,
    onEnabledChange: (val) => update(`enabledSections.${key}`, val)
  });

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-brown-light mb-1">Customize Your Guide</p>
      <h2 className="font-display text-xl text-brown-dark mb-5">Step through the sections below</h2>

      {/* === PROPERTY DETAILS === */}
      <SectionAccordion title="Property Details" number="1" defaultOpen={true}>
        <TextField label="Property Name" value={data.propertyName} onChange={v => update('propertyName', v)} placeholder="Your Property" />
        <TextField label="Tagline" value={data.tagline} onChange={v => update('tagline', v)} placeholder="Guest Guide" />
        <p className="text-[11px] text-brown-light -mt-1 mb-2 italic">Phone, email & location below appear on the hero page and Contact modal.</p>
        <TextField label="Phone Number" value={data.phone} onChange={v => update('phone', v)} placeholder="+1 234 567 8901" />
        <TextField label="Email Address" value={data.email} onChange={v => update('email', v)} type="email" placeholder="host@example.com" />
        <TextField label="Address" value={data.address} onChange={v => update('address', v)} placeholder="123 Example St" />
        <TextField label="City" value={data.city} onChange={v => update('city', v)} placeholder="City" />
        <TextField label="Country" value={data.country} onChange={v => update('country', v)} placeholder="Country" />
      </SectionAccordion>

      {/* === BRANDING === */}
      <SectionAccordion title="Branding & Colors" number="2">
        <p className="text-xs text-brown-mid mb-3">Quick presets:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {COLOR_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border rounded hover:border-brown-deep transition-colors bg-white"
              title={preset.name}
            >
              <span className="w-3 h-3 rounded-sm" style={{ background: preset.primary }} />
              <span className="w-3 h-3 rounded-sm" style={{ background: preset.accent }} />
              {preset.name}
            </button>
          ))}
        </div>
        <ColorField label="Primary Color (Background)" value={data.colorPrimary} onChange={v => update('colorPrimary', v)} />
        <ColorField label="Accent Color (Text/Buttons)" value={data.colorAccent} onChange={v => update('colorAccent', v)} />
        <ColorField label="Secondary Color (Subtle Text)" value={data.colorMid} onChange={v => update('colorMid', v)} />

        <div className="my-4 pt-4 border-t border-border/40">
          <p className="text-xs uppercase tracking-wider text-brown-mid mb-2">Typography</p>
          <FontPicker label="Display Font (Headings)" value={data.fontDisplay} onChange={v => update('fontDisplay', v)} fonts={DISPLAY_FONTS} />
          <FontPicker label="Body Font (Text)" value={data.fontBody} onChange={v => update('fontBody', v)} fonts={BODY_FONTS} />
        </div>

        <div className="my-4 pt-4 border-t border-border/40">
          <p className="text-xs uppercase tracking-wider text-brown-mid mb-2">Hero Card Style</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { value: 'frosted', label: 'Frosted', desc: 'Blurred' },
              { value: 'solid', label: 'Solid', desc: 'Opaque' },
              { value: 'transparent', label: 'Translucent', desc: 'See-through' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => update('heroCardStyle', opt.value)}
                className={`px-2 py-2 text-xs border rounded transition-colors ${
                  data.heroCardStyle === opt.value
                    ? 'border-brown-deep bg-brown-deep text-white'
                    : 'border-border bg-white text-brown-dark hover:border-brown-mid'
                }`}
              >
                <div className="font-medium">{opt.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>

          <ColorField label="Hero Card Color" value={data.heroCardColor} onChange={v => update('heroCardColor', v)} />

          {data.heroCardStyle !== 'solid' && (
            <div className="mb-3">
              <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
                Card Opacity ({Math.round((data.heroCardOpacity ?? 0.72) * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={data.heroCardOpacity ?? 0.72}
                onChange={e => update('heroCardOpacity', parseFloat(e.target.value))}
                className="w-full accent-brown-deep"
              />
            </div>
          )}

          {data.heroCardStyle === 'frosted' && (
            <div className="mb-3">
              <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
                Blur Strength ({data.heroCardBlur ?? 18}px)
              </label>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={data.heroCardBlur ?? 18}
                onChange={e => update('heroCardBlur', parseInt(e.target.value, 10))}
                className="w-full accent-brown-deep"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5">
              Hero Photo Dimming ({Math.round((data.heroOverlayOpacity ?? 0.48) * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={data.heroOverlayOpacity ?? 0.48}
              onChange={e => update('heroOverlayOpacity', parseFloat(e.target.value))}
              className="w-full accent-brown-deep"
            />
          </div>
        </div>
      </SectionAccordion>

      {/* === IMAGES === */}
      <SectionAccordion title="Images" number="3">
        <p className="text-xs text-brown-mid mb-3">Upload photos for the hero, logo, and each section. Recommended size: 1200×800px.</p>
        <ImageUpload label="Logo (PNG, transparent)" file={data.images.logo} onChange={f => updateImage('logo', f)} hint="Shown in hero card. Recommended: 400×200px PNG." />
        <ImageUpload label="Hero Background" file={data.images.hero} onChange={f => updateImage('hero', f)} hint="Full-screen background photo on landing." />
        <div className="my-3 pt-3 border-t border-border/40">
          <p className="text-xs uppercase tracking-wider text-brown-mid mb-2">Section Covers</p>
        </div>
        <ImageUpload label="Welcome Cover" file={data.images.coverWelcome} onChange={f => updateImage('coverWelcome', f)} />
        <ImageUpload label="Accommodations Cover" file={data.images.coverAccommodations} onChange={f => updateImage('coverAccommodations', f)} />
        <ImageUpload label="Check-in/Out Cover" file={data.images.coverCheckin} onChange={f => updateImage('coverCheckin', f)} />
        <ImageUpload label="Amenities Cover" file={data.images.coverAmenities} onChange={f => updateImage('coverAmenities', f)} />
        <ImageUpload label="WiFi Cover" file={data.images.coverWifi} onChange={f => updateImage('coverWifi', f)} />
        <ImageUpload label="House Rules Cover" file={data.images.coverRules} onChange={f => updateImage('coverRules', f)} />
        <ImageUpload label="Kitchen Cover" file={data.images.coverKitchen} onChange={f => updateImage('coverKitchen', f)} />
        <ImageUpload label="Nearby Cover" file={data.images.coverNearby} onChange={f => updateImage('coverNearby', f)} />
        <ImageUpload label="Emergency Cover" file={data.images.coverEmergency} onChange={f => updateImage('coverEmergency', f)} />
        <ImageUpload label="Pet Policy Cover" file={data.images.coverPets} onChange={f => updateImage('coverPets', f)} />
        <ImageUpload label="Reviews Cover" file={data.images.coverReviews} onChange={f => updateImage('coverReviews', f)} />
        <ImageUpload label="Contact Cover" file={data.images.coverContact} onChange={f => updateImage('coverContact', f)} />
      </SectionAccordion>

      {/* === WELCOME MESSAGE === */}
      <SectionAccordion title="Welcome Message" number="4" {...previewProps('modal-welcome')} {...enabledProps('welcome')}>
        <TextArea label="Note Paragraph 1" value={data.welcomeNote1} onChange={v => update('welcomeNote1', v)} rows={3} />
        <TextArea label="Note Paragraph 2 (Personal)" value={data.welcomeNote2} onChange={v => update('welcomeNote2', v)} rows={3} />
        <TextArea label="Note Paragraph 3 (Closing)" value={data.welcomeNote3} onChange={v => update('welcomeNote3', v)} rows={3} />
      </SectionAccordion>

      {/* === ACCOMMODATIONS === */}
      <SectionAccordion title="Accommodations" number="5" {...previewProps('modal-accommodations')} {...enabledProps('accommodations')}>
        <TextArea label="Property Description" value={data.accomDescription} onChange={v => update('accomDescription', v)} rows={2} />
        <TextField label="Bedrooms" value={data.accomBedrooms} onChange={v => update('accomBedrooms', v)} />
        <TextField label="Bathrooms" value={data.accomBathrooms} onChange={v => update('accomBathrooms', v)} />
        <TextField label="Kitchen" value={data.accomKitchen} onChange={v => update('accomKitchen', v)} />
        <TextField label="Entertainment" value={data.accomEntertainment} onChange={v => update('accomEntertainment', v)} />
        <TextField label="Climate" value={data.accomClimate} onChange={v => update('accomClimate', v)} />
        <TextField label="Entry" value={data.accomEntry} onChange={v => update('accomEntry', v)} />
        <TextField label="Parking" value={data.accomParking} onChange={v => update('accomParking', v)} />
      </SectionAccordion>

      {/* === CHECK-IN/OUT === */}
      <SectionAccordion title="Check-in & Check-out" number="6" {...previewProps('modal-checkin')} {...enabledProps('checkin')}>
        <TextField label="Check-in Time" value={data.checkinTime} onChange={v => update('checkinTime', v)} placeholder="3:00 PM" />
        <TextArea label="Check-in Note" value={data.checkinNote} onChange={v => update('checkinNote', v)} rows={2} />
        <StringListEditor label="Arrival Steps" items={data.checkinSteps} onChange={v => update('checkinSteps', v)} placeholder="Park at the designated area..." />
        <div className="my-3 border-t border-border/40" />
        <TextField label="Check-out Time" value={data.checkoutTime} onChange={v => update('checkoutTime', v)} placeholder="11:00 AM" />
        <TextArea label="Check-out Note" value={data.checkoutNote} onChange={v => update('checkoutNote', v)} rows={2} />
        <StringListEditor label="Check-out Tasks" items={data.checkoutTasks} onChange={v => update('checkoutTasks', v)} placeholder="Wash and put away dishes" />
      </SectionAccordion>

      {/* === AMENITIES === */}
      <SectionAccordion title="Amenities" number="7" {...previewProps('modal-amenities')} {...enabledProps('amenities')}>
        <StringListEditor label="Sleeping" items={data.amenitySleeping} onChange={v => update('amenitySleeping', v)} />
        <StringListEditor label="Bathroom" items={data.amenityBathroom} onChange={v => update('amenityBathroom', v)} />
        <StringListEditor label="Living Room" items={data.amenityLiving} onChange={v => update('amenityLiving', v)} />
        <StringListEditor label="Workspace" items={data.amenityWorkspace} onChange={v => update('amenityWorkspace', v)} />
        <StringListEditor label="Kitchen" items={data.amenityKitchen} onChange={v => update('amenityKitchen', v)} />
        <StringListEditor label="Outdoor" items={data.amenityOutdoor} onChange={v => update('amenityOutdoor', v)} />
      </SectionAccordion>

      {/* === WIFI === */}
      <SectionAccordion title="WiFi" number="8" {...previewProps('modal-wifi')} {...enabledProps('wifi')}>
        <TextField label="Network Name (SSID)" value={data.wifiNetwork} onChange={v => update('wifiNetwork', v)} />
        <TextField label="Password" value={data.wifiPassword} onChange={v => update('wifiPassword', v)} />
        <TextField label="Speed" value={data.wifiSpeed} onChange={v => update('wifiSpeed', v)} placeholder="100 Mbps fiber" />
        <TextField label="Router Location" value={data.wifiRouterLocation} onChange={v => update('wifiRouterLocation', v)} placeholder="living room shelf" />
        <ImageUpload
          label="WiFi QR Code"
          file={data.images.wifiQr}
          onChange={f => updateImage('wifiQr', f)}
          hint="Upload a QR code image so guests can scan to connect. Generate one at qifi.org or similar."
        />
      </SectionAccordion>

      {/* === HOUSE RULES === */}
      <SectionAccordion title="House Rules" number="9" {...previewProps('modal-rules')} {...enabledProps('rules')}>
        {(data.rules || []).map((rule, i) => (
          <div key={i} className="mb-3 p-3 border border-border rounded bg-cream-light/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-brown-mid">Rule {i + 1}</span>
              <button
                onClick={() => update('rules', data.rules.filter((_, idx) => idx !== i))}
                className="text-xs text-brown-light hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <TextField label="Title" value={rule.title} onChange={v => {
              const next = [...data.rules];
              next[i] = { ...next[i], title: v };
              update('rules', next);
            }} />
            <TextArea label="Description" value={rule.text} onChange={v => {
              const next = [...data.rules];
              next[i] = { ...next[i], text: v };
              update('rules', next);
            }} rows={2} />
          </div>
        ))}
        <button
          onClick={() => update('rules', [...(data.rules || []), { title: '', text: '' }])}
          className="text-xs text-brown-deep hover:underline"
        >
          + Add rule
        </button>
      </SectionAccordion>

      {/* === KITCHEN === */}
      <SectionAccordion title="Kitchen & Dining" number="10" {...previewProps('modal-kitchen')} {...enabledProps('kitchen')}>
        <StringListEditor label="Cooking Equipment" items={data.kitchenEquipment} onChange={v => update('kitchenEquipment', v)} />
        <StringListEditor label="Storage & Dining" items={data.kitchenStorage} onChange={v => update('kitchenStorage', v)} />
        <StringListEditor label="Notes" items={data.kitchenNotes} onChange={v => update('kitchenNotes', v)} />
      </SectionAccordion>

      {/* === NEARBY === */}
      <SectionAccordion title="Explore Nearby" number="11" {...previewProps('modal-nearby')} {...enabledProps('nearby')}>
        <p className="text-xs text-brown-mid mb-3">
          Each place becomes a card with photo on one side and details on the other. Cards alternate left/right automatically.
        </p>
        {(data.nearby || []).map((place, i) => (
          <div key={place.id || i} className="mb-4 p-3 border border-border rounded bg-cream-light/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-brown-mid">Place {i + 1}</span>
              <button
                onClick={() => update('nearby', data.nearby.filter((_, idx) => idx !== i))}
                className="text-xs text-brown-light hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="col-span-1">
                <TextField label="Emoji" value={place.emoji} onChange={v => {
                  const next = [...data.nearby];
                  next[i] = { ...next[i], emoji: v };
                  update('nearby', next);
                }} placeholder="🌲" />
              </div>
              <div className="col-span-2">
                <TextField label="Category" value={place.type} onChange={v => {
                  const next = [...data.nearby];
                  next[i] = { ...next[i], type: v };
                  update('nearby', next);
                }} placeholder="Dining" />
              </div>
            </div>
            <TextField label="Name" value={place.name} onChange={v => {
              const next = [...data.nearby];
              next[i] = { ...next[i], name: v };
              update('nearby', next);
            }} placeholder="The Local Kitchen" />
            <TextField label="Distance / Travel Time" value={place.distance} onChange={v => {
              const next = [...data.nearby];
              next[i] = { ...next[i], distance: v };
              update('nearby', next);
            }} placeholder="5 min away" />
            <TextArea label="Description" value={place.description} onChange={v => {
              const next = [...data.nearby];
              next[i] = { ...next[i], description: v };
              update('nearby', next);
            }} rows={3} />
            <ImageUpload label="Photo of this place" file={place.image} onChange={f => {
              const next = [...data.nearby];
              next[i] = { ...next[i], image: f };
              update('nearby', next);
            }} hint="Recommended: 600×400px landscape." />
          </div>
        ))}
        <button
          onClick={() => {
            const newId = 'n' + Math.random().toString(36).slice(2, 6);
            update('nearby', [
              ...(data.nearby || []),
              { id: newId, type: '', emoji: '', name: '', distance: '', description: '', image: null }
            ]);
          }}
          className="mt-2 px-4 py-2 bg-brown-deep text-white text-xs uppercase tracking-wider rounded hover:bg-brown-dark transition-colors"
        >
          + Add Place
        </button>
      </SectionAccordion>

      {/* === EMERGENCY === */}
      <SectionAccordion title="Emergency Contacts" number="12" {...previewProps('modal-emergency')} {...enabledProps('emergency')}>
        <p className="text-xs uppercase tracking-wider text-brown-mid mb-2 mt-2">Hospital</p>
        <TextField label="Name" value={data.emergencyHospital?.name} onChange={v => update('emergencyHospital.name', v)} />
        <TextField label="Phone" value={data.emergencyHospital?.phone} onChange={v => update('emergencyHospital.phone', v)} />
        <TextField label="Address" value={data.emergencyHospital?.address} onChange={v => update('emergencyHospital.address', v)} />
        <div className="my-3 border-t border-border/40" />
        <p className="text-xs uppercase tracking-wider text-brown-mid mb-2">Police</p>
        <TextField label="Name" value={data.emergencyPolice?.name} onChange={v => update('emergencyPolice.name', v)} />
        <TextField label="Phone" value={data.emergencyPolice?.phone} onChange={v => update('emergencyPolice.phone', v)} />
        <div className="my-3 border-t border-border/40" />
        <p className="text-xs uppercase tracking-wider text-brown-mid mb-2">Fire</p>
        <TextField label="Name" value={data.emergencyFire?.name} onChange={v => update('emergencyFire.name', v)} />
        <TextField label="Phone" value={data.emergencyFire?.phone} onChange={v => update('emergencyFire.phone', v)} />
        <div className="my-3 border-t border-border/40" />
        <TextField label="Host Emergency Phone" value={data.emergencyHostPhone} onChange={v => update('emergencyHostPhone', v)} />
        <TextField label="Fire Extinguisher Location" value={data.fireExtinguisherLocation} onChange={v => update('fireExtinguisherLocation', v)} placeholder="Kitchen, under the sink" />
      </SectionAccordion>

      {/* === PETS === */}
      <SectionAccordion title="Pet Policy" number="13" {...previewProps('modal-pets')} {...enabledProps('pets')}>
        <label className="block text-xs uppercase tracking-wider text-brown-mid mb-2">Pet Policy Status</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => update('petsAllowed', true)}
            className={`px-3 py-3 text-sm border rounded transition-colors flex items-center justify-center gap-2 ${
              data.petsAllowed !== false
                ? 'border-green-700 bg-green-50 text-green-800'
                : 'border-border bg-white text-brown-mid hover:border-brown-mid'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="font-medium">Pets Allowed</span>
          </button>
          <button
            type="button"
            onClick={() => update('petsAllowed', false)}
            className={`px-3 py-3 text-sm border rounded transition-colors flex items-center justify-center gap-2 ${
              data.petsAllowed === false
                ? 'border-red-700 bg-red-50 text-red-800'
                : 'border-border bg-white text-brown-mid hover:border-brown-mid'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            <span className="font-medium">Not Allowed</span>
          </button>
        </div>

        {data.petsAllowed !== false ? (
          <>
            <TextField label="Policy Statement" value={data.petPolicy} onChange={v => update('petPolicy', v)} placeholder="Well-behaved pets are welcome." />
            <TextField label="Pet Fee" value={data.petFee} onChange={v => update('petFee', v)} placeholder="$25 per stay (leave blank to hide)" />
            <StringListEditor label="Guidelines" items={data.petGuidelines} onChange={v => update('petGuidelines', v)} />
          </>
        ) : (
          <>
            <TextField label="No-Pets Message" value={data.petNotAllowedMessage} onChange={v => update('petNotAllowedMessage', v)} placeholder="Unfortunately, we are not able to accommodate pets at this property." />
            <TextArea label="Explanation (optional)" value={data.petNotAllowedReason} onChange={v => update('petNotAllowedReason', v)} rows={4} placeholder="Brief explanation of why pets aren't allowed (e.g., allergies, lease restrictions)." />
          </>
        )}
      </SectionAccordion>

      {/* === REVIEWS === */}
      <SectionAccordion title="Guest Reviews" number="14" {...previewProps('modal-reviews')} {...enabledProps('reviews')}>
        {(data.reviews || []).map((review, i) => (
          <div key={i} className="mb-3 p-3 border border-border rounded bg-cream-light/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-brown-mid">Review {i + 1}</span>
              <button
                onClick={() => update('reviews', data.reviews.filter((_, idx) => idx !== i))}
                className="text-xs text-brown-light hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <TextArea label="Review Text" value={review.text} onChange={v => {
              const next = [...data.reviews];
              next[i] = { ...next[i], text: v };
              update('reviews', next);
            }} rows={3} />
            <TextField label="Author Name" value={review.author} onChange={v => {
              const next = [...data.reviews];
              next[i] = { ...next[i], author: v };
              update('reviews', next);
            }} />
            <TextField label="Platform" value={review.platform} onChange={v => {
              const next = [...data.reviews];
              next[i] = { ...next[i], platform: v };
              update('reviews', next);
            }} placeholder="Airbnb / Booking.com / Google" />
          </div>
        ))}
        <button
          onClick={() => update('reviews', [...(data.reviews || []), { text: '', author: '', platform: '' }])}
          className="text-xs text-brown-deep hover:underline"
        >
          + Add review
        </button>
      </SectionAccordion>

      {/* === CONTACT === */}
      <SectionAccordion title="Contact / Host Info" number="15" {...previewProps('modal-contact')} {...enabledProps('contact')}>
        <ImageUpload
          label="Host Photo"
          file={data.images.hostPhoto}
          onChange={f => updateImage('hostPhoto', f)}
          hint="Square photo recommended. Will be cropped into a circle."
        />
        <TextField label="Host Name" value={data.hostName} onChange={v => update('hostName', v)} />
        <TextArea label="Host Quote" value={data.hostQuote} onChange={v => update('hostQuote', v)} rows={2} />
        <TextArea label="Host Bio" value={data.hostBio} onChange={v => update('hostBio', v)} rows={3} />

        <div className="my-4 pt-4 border-t border-border/40">
          <p className="text-xs uppercase tracking-wider text-brown-mid mb-1">Contact Methods</p>
          <p className="text-[11px] text-brown-light mb-3">Phone and email also appear on the hero page. Editing here updates both places.</p>
          <TextField label="Phone Number" value={data.phone} onChange={v => update('phone', v)} placeholder="+1 234 567 8901" />
          <TextField label="Email Address" value={data.email} onChange={v => update('email', v)} type="email" placeholder="host@example.com" />
          <TextField label="WhatsApp Link" value={data.whatsappLink} onChange={v => update('whatsappLink', v)} placeholder="https://wa.me/..." />
          <TextField label="Airbnb Profile Link" value={data.airbnbLink} onChange={v => update('airbnbLink', v)} placeholder="https://airbnb.com/..." />
        </div>

        <div className="my-4 pt-4 border-t border-border/40">
          <p className="text-xs uppercase tracking-wider text-brown-mid mb-1">Social Media</p>
          <p className="text-[11px] text-brown-light mb-3">Leave blank to hide. Icons appear in Contact modal and Footer.</p>
          <SocialInput icon="facebook"  label="Facebook"  value={data.socialFacebook}  onChange={v => update('socialFacebook', v)}  placeholder="https://facebook.com/..." />
          <SocialInput icon="instagram" label="Instagram" value={data.socialInstagram} onChange={v => update('socialInstagram', v)} placeholder="https://instagram.com/..." />
          <SocialInput icon="tiktok"    label="TikTok"    value={data.socialTiktok}    onChange={v => update('socialTiktok', v)}    placeholder="https://tiktok.com/@..." />
          <SocialInput icon="twitter"   label="X (Twitter)" value={data.socialTwitter} onChange={v => update('socialTwitter', v)}   placeholder="https://x.com/..." />
          <SocialInput icon="youtube"   label="YouTube"   value={data.socialYoutube}   onChange={v => update('socialYoutube', v)}   placeholder="https://youtube.com/..." />
          <SocialInput icon="pinterest" label="Pinterest" value={data.socialPinterest} onChange={v => update('socialPinterest', v)} placeholder="https://pinterest.com/..." />
          <SocialInput icon="linkedin"  label="LinkedIn"  value={data.socialLinkedin}  onChange={v => update('socialLinkedin', v)}  placeholder="https://linkedin.com/in/..." />
        </div>
      </SectionAccordion>

      {/* === CUSTOM SECTIONS === */}
      <SectionAccordion title="Custom Sections (Add More)" number="16">
        <p className="text-xs text-brown-mid mb-3">
          Add your own custom cards to the guide. Each card can open its own content modal, or link out to an external website in a new tab.
        </p>
        {(data.customSections || []).map((cs, i) => {
          const setField = (field, value) => {
            const next = [...data.customSections];
            next[i] = { ...next[i], [field]: value };
            update('customSections', next);
          };
          const linkType = cs.linkType || 'modal';
          return (
          <div key={cs.id} className="mb-4 p-3 border border-border rounded bg-cream-light/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-brown-mid">Section {i + 1}</span>
              <button
                onClick={() => update('customSections', data.customSections.filter((_, idx) => idx !== i))}
                className="text-xs text-brown-light hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <TextField label="Title (shown on card)" value={cs.title} onChange={v => setField('title', v)} placeholder="Pool & Hot Tub" />
            <IconPicker label="Icon" value={cs.icon} onChange={v => setField('icon', v)} />

            {/* Card behavior toggle */}
            <label className="block text-xs uppercase tracking-wider text-brown-mid mb-1.5 mt-2">When card is tapped</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setField('linkType', 'modal')}
                className={`px-2 py-2 text-xs border rounded transition-colors ${
                  linkType === 'modal'
                    ? 'border-brown-deep bg-brown-deep text-white'
                    : 'border-border bg-white text-brown-dark hover:border-brown-mid'
                }`}
              >
                <div className="font-medium">Open Content</div>
                <div className="text-[10px] opacity-70 mt-0.5">Show a modal</div>
              </button>
              <button
                type="button"
                onClick={() => setField('linkType', 'external')}
                className={`px-2 py-2 text-xs border rounded transition-colors ${
                  linkType === 'external'
                    ? 'border-brown-deep bg-brown-deep text-white'
                    : 'border-border bg-white text-brown-dark hover:border-brown-mid'
                }`}
              >
                <div className="font-medium">Open Link</div>
                <div className="text-[10px] opacity-70 mt-0.5">New browser tab</div>
              </button>
            </div>

            {linkType === 'external' ? (
              <TextField
                label="External URL"
                value={cs.externalUrl}
                onChange={v => setField('externalUrl', v)}
                type="url"
                placeholder="https://casa-nosa-booking.vercel.app/"
              />
            ) : (
              <>
                <TextField label="Modal Subtitle" value={cs.subtitle} onChange={v => setField('subtitle', v)} placeholder="Everything you need to know" />
                <TextField label="Content Label (e.g. 'Details')" value={cs.label} onChange={v => setField('label', v)} placeholder="Details" />
                <TextArea label="Content (separate paragraphs with blank lines)" value={cs.content} onChange={v => setField('content', v)} rows={5} placeholder="Write the content for this section. Use blank lines to separate paragraphs." />
                <ImageUpload label="Cover Image (optional)" file={cs.coverImage} onChange={f => setField('coverImage', f)} hint="Shown at the top of the section's modal." />
              </>
            )}
          </div>
          );
        })}
        <button
          onClick={() => {
            const newId = 'cs-' + Math.random().toString(36).slice(2, 8);
            update('customSections', [
              ...(data.customSections || []),
              { id: newId, title: 'New Section', icon: 'info', linkType: 'modal', subtitle: '', label: 'Details', content: '', coverImage: null, externalUrl: '' }
            ]);
          }}
          className="mt-2 px-4 py-2 bg-brown-deep text-white text-xs uppercase tracking-wider rounded hover:bg-brown-dark transition-colors"
        >
          + Add Custom Section
        </button>
      </SectionAccordion>

      <div className="mt-6 p-4 bg-brown-deep/5 border border-brown-deep/10 rounded-lg">
        <p className="text-xs text-brown-mid leading-relaxed">
          <strong className="text-brown-dark">Done customizing?</strong> Click the <strong>Download</strong> button in the top right to get your guide as a ZIP file. Upload it to Netlify or Vercel to publish.
        </p>
      </div>
    </div>
  );
}
