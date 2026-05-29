// Default data for a new guide — provides example placeholder content
export const defaultData = {
  // Branding
  propertyName: 'Your Property',
  tagline: 'Guest Guide',
  phone: '+1 234 567 8901',
  email: 'host@example.com',
  locationLabel: '', // Text shown on the hero location row (e.g. "Cavite, Philippines")
  propertyMapsUrl: '', // Google Maps link for the property — hero location opens navigation

  // Fonts (Google Fonts family names)
  fontDisplay: 'Cormorant Garamond',
  fontBody: 'Jost',

  // Custom sections (user-added cards)
  customSections: [],

  // Which default sections are visible (true = shown on guide grid + modal exists)
  enabledSections: {
    welcome: true,
    accommodations: true,
    checkin: true,
    amenities: true,
    wifi: true,
    rules: true,
    kitchen: true,
    nearby: true,
    emergency: true,
    pets: true,
    reviews: true,
    contact: true
  },

  // Theme colors
  colorPrimary: '#F0EDE8',    // cream (background)
  colorAccent: '#3A2415',     // brown-deep (text/buttons)
  colorMid: '#7A6555',        // brown-mid (secondary text)

  // Hero card appearance
  heroCardStyle: 'frosted',   // 'frosted' | 'solid' | 'transparent'
  heroCardColor: '#2A1A0E',   // base color for the card
  heroCardOpacity: 0.72,      // 0-1 (for frosted/transparent)
  heroCardBlur: 18,           // px (for frosted)
  heroOverlayOpacity: 0.48,   // 0-1 — darkens hero background photo

  // Images (will be Files objects when uploaded)
  images: {
    logo: null,
    hero: null,
    coverWelcome: null,
    coverAccommodations: null,
    coverCheckin: null,
    coverAmenities: null,
    coverWifi: null,
    coverRules: null,
    coverKitchen: null,
    coverNearby: null,
    coverEmergency: null,
    coverPets: null,
    coverReviews: null,
    coverContact: null,
    wifiQr: null,
    hostPhoto: null
  },

  // Welcome section
  welcomeIntro: 'We are so glad you chose to stay with us. This guide covers everything you need for a comfortable, effortless stay. Tap any section below to get started.',
  welcomeNote1: 'Welcome — we are so happy to have you here. This place holds a special meaning to us, and it is a genuine joy to share it with wonderful guests like you.',
  welcomeNote2: 'Add your personal welcome message here. You might share what makes the property special, your favourite nearby spot, a little tip about the neighbourhood, or simply a warm greeting.',
  welcomeNote3: 'Please make yourself at home. If there is anything you need — big or small — do not hesitate to reach out. We want your stay to be truly unforgettable.',

  // Accommodations
  accomDescription: 'A thoughtfully designed retreat, ready for your arrival.',
  accomBedrooms: '2 bedrooms, sleeps up to 4 guests',
  accomBathrooms: '1 bathroom',
  accomKitchen: 'Fully equipped',
  accomEntertainment: 'Smart TV — Netflix & YouTube',
  accomClimate: 'Air conditioning throughout',
  accomEntry: 'Keypad access',
  accomParking: 'Free, on site',

  // Check-in / Check-out
  checkinTime: '3:00 PM',
  checkinNote: 'Early check-in may be available — please message us in advance.',
  checkinSteps: [
    'Park at the designated area on the left',
    'Proceed to the main entrance',
    'Enter the keypad code sent to you',
    'Your welcome kit is inside — enjoy!'
  ],
  checkoutTime: '11:00 AM',
  checkoutNote: 'Please complete the following before leaving.',
  checkoutTasks: [
    'Wash and put away dishes',
    'Collect all personal belongings',
    'Dispose of all garbage',
    'Return keys and lock up',
    'Turn off all lights, fans & AC',
    'Close and lock all windows & doors'
  ],

  // Amenities
  amenitySleeping: [
    'Fresh bed linens & pillowcases',
    'Extra pillows & blankets',
    'Queen bed in master room',
    'Twin beds in second room'
  ],
  amenityBathroom: [
    'Hot & cold shower',
    'Fresh towels provided',
    'Hair dryer',
    'Basic toiletries'
  ],
  amenityLiving: [
    'Smart TV — Netflix, YouTube',
    'Comfortable sofa',
    'Air conditioning',
    'Ceiling fan'
  ],
  amenityWorkspace: [
    'High-speed WiFi',
    'Work desk & chair',
    'Power outlets & USB ports'
  ],
  amenityKitchen: [
    'Full refrigerator',
    'Microwave & rice cooker',
    'Electric kettle',
    'Cooking utensils & pots'
  ],
  amenityOutdoor: [
    'Garden / Terrace',
    'Parking',
    'Washing machine'
  ],

  // WiFi
  wifiNetwork: 'GuestWiFi',
  wifiPassword: 'welcome2024',
  wifiSpeed: '100 Mbps fiber',
  wifiRouterLocation: 'living room shelf',

  // House Rules
  rules: [
    { title: 'Quiet Hours', text: '10:00 PM – 7:00 AM. Please keep noise to a considerate level out of respect for neighbors.' },
    { title: 'No Smoking Indoors', text: 'Smoking is permitted only in designated outdoor areas. No vaping indoors.' },
    { title: 'No Unauthorized Gatherings', text: 'Small gatherings are welcome. Larger events require prior host approval.' },
    { title: 'Waste Management', text: 'Sort and dispose of trash in the provided bins. Bags are in the kitchen cabinet.' },
    { title: 'Supervise Children', text: 'Children must be supervised at all times, especially near stairs and outdoor areas.' },
    { title: 'Cleanliness', text: 'Please keep the space tidy. Wash dishes after use and dispose of food waste promptly.' }
  ],

  // Kitchen & Dining
  kitchenEquipment: [
    'Gas / Electric stove',
    'Rice cooker',
    'Microwave oven',
    'Electric kettle',
    'Pots and pans — various sizes',
    'Knife set & cutting board',
    'Full set of utensils & serving ware',
    'Food storage containers'
  ],
  kitchenStorage: [
    'Full-size refrigerator',
    'Pantry & cabinet storage',
    'Plates, bowls & glasses',
    'Chopsticks & complete cutlery',
    'Dining table for 4 guests'
  ],
  kitchenNotes: [
    'Please clean up after cooking',
    'Basic condiments & oil provided',
    'Nearest grocery: 5 minutes away'
  ],

  // Nearby
  nearby: [
    { id: 'n1', type: 'Beach & Nature', emoji: '🌲', name: 'Lakeside Park', distance: '5 min away', description: 'A scenic park with walking trails and picnic spots — perfect for a quiet morning.', image: null, mapsUrl: '', showMap: true },
    { id: 'n2', type: 'Dining', emoji: '🍽️', name: 'The Local Kitchen', distance: '8 min away', description: 'Family-run restaurant serving authentic local cuisine. Try the daily specials.', image: null, mapsUrl: '', showMap: true },
    { id: 'n3', type: 'Essentials', emoji: '🛒', name: 'SuperMart Grocery', distance: '5 min away', description: 'Full-service grocery store. Open daily 7 AM – 10 PM.', image: null, mapsUrl: '', showMap: true },
    { id: 'n4', type: 'Landmark', emoji: '🏛️', name: 'Historic Town Square', distance: '15 min away', description: 'Charming downtown area with cafés, shops, and weekend markets.', image: null, mapsUrl: '', showMap: true },
    { id: 'n5', type: 'Medical', emoji: '🏥', name: 'City General Hospital', distance: '10 min away', description: 'Full-service emergency hospital with 24/7 care.', image: null, mapsUrl: '', showMap: true },
    { id: 'n6', type: 'Transport', emoji: '🚕', name: 'Bus Stop & Taxis', distance: 'Just outside', description: 'Public transit and ride-share options easily available.', image: null, mapsUrl: '', showMap: true }
  ],

  // Emergency
  emergencyHospital: { name: 'City General Hospital', phone: '+1 555 123 4567', address: '456 Main St, 10 min away' },
  emergencyPolice: { name: 'Local Police Station', phone: '+1 555 234 5678' },
  emergencyFire: { name: 'Fire Department', phone: '+1 555 345 6789' },
  emergencyHostPhone: '+1 234 567 8901',
  fireExtinguisherLocation: 'Kitchen, under the sink',

  // Pet Policy
  petsAllowed: true,
  petPolicy: 'Well-behaved pets are welcome.',
  petFee: '$25 per stay',
  petGuidelines: [
    'Please inform us in advance if bringing a pet',
    'Pets must be kept on a leash in common areas',
    'Please clean up after your pet at all times',
    'Pets are not allowed on furniture or beds',
    'Any pet-related damages will be charged accordingly'
  ],
  petNotAllowedMessage: 'Unfortunately, we are not able to accommodate pets at this property.',
  petNotAllowedReason: 'To maintain the cleanliness and comfort of our space for all guests — including those with allergies — we have a strict no-pets policy. We appreciate your understanding.',

  // Reviews
  reviews: [
    { text: 'The property was immaculate, the host was incredibly responsive, and the location was perfect. Highly recommend.', author: 'Sarah M.', platform: 'Airbnb' },
    { text: 'Great value for the price. Clean, comfortable, and well-equipped. Perfect for our family trip.', author: 'James K.', platform: 'Booking.com' },
    { text: 'Loved everything about this place. The host went above and beyond. We will definitely be back.', author: 'Maria L.', platform: 'Google Reviews' }
  ],

  // Contact
  hostName: 'Your Host',
  hostQuote: 'We pride ourselves on offering a clean, comfortable, and welcoming space for every guest.',
  hostBio: 'Welcome — we love sharing our home with travelers. Please reach out anytime during your stay if you need anything at all.',
  whatsappLink: '',
  airbnbLink: '',

  // Social Media (leave blank to hide)
  socialFacebook:  '',
  socialInstagram: '',
  socialTiktok:    '',
  socialTwitter:   '',
  socialYoutube:   '',
  socialPinterest: '',
  socialLinkedin:  ''
};
