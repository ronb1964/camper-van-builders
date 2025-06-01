#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌴 Updating Florida van builders data...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Get coordinates for Florida cities
function getFloridaCoordinates(city) {
  const coordinates = {
    'Fort Lauderdale': { lat: 26.1224, lng: -80.1373 }, // Woodpecker Crafts (Broward County)
    'North Miami Beach': { lat: 25.9331, lng: -80.1628 }, // Mango Vans
    'Miramar': { lat: 25.9860, lng: -80.2323 }, // Van Conversion Shop
    'Sarasota': { lat: 27.3364, lng: -82.5307 }, // Our Van Quest
    'Hudson': { lat: 28.3647, lng: -82.6912 } // Modern Times Van Co
  };
  return coordinates[city] || { lat: 27.7663, lng: -82.6404 }; // Default to Tampa if not found
}

// Authentic Florida builders data
const authenticBuilders = [
  {
    name: "Woodpecker Crafts and Builds LLC",
    location: {
      city: "Fort Lauderdale",
      state: "Florida",
      ...getFloridaCoordinates("Fort Lauderdale"),
      zip: "33301"
    },
    phone: "(954) 200-5350",
    email: "woodpeckercraftsandbuilds@gmail.com",
    website: "https://woodpeckercraftsandbuilds.com/",
    description: "Artistic custom van conversions featuring cedar wood interiors, fold-out beds, and functional living spaces. Serving Dade, Broward, and Palm Beach counties.",
    vanTypes: ["Sprinter", "Transit", "Promaster", "Custom"],
    priceRange: {
      min: 30000,
      max: 120000
    },
    amenities: [
      "Cedar Wood Interiors",
      "Fold-out Beds",
      "Functional Sink",
      "Ample Storage",
      "Porta Potty"
    ],
    services: [
      "Custom Builds",
      "Artistic Woodwork",
      "Interior Design",
      "Consultation"
    ],
    certifications: [],
    leadTime: "2-6 months",
    socialMedia: {
      facebook: null,
      instagram: "https://www.instagram.com/woodpeckercraftsandbuilds/",
      youtube: "https://www.youtube.com/@woodpeckercraftsandbuilds"
    },
    gallery: []
  },
  {
    name: "Mango Vans",
    location: {
      city: "North Miami Beach",
      state: "Florida",
      ...getFloridaCoordinates("North Miami Beach"),
      zip: "33162"
    },
    phone: "(305) 204-2550",
    email: "mat@mangovans.com",
    website: "https://www.mangovans.com/",
    description: "Adventure van builders creating custom conversions with unique Miami Mango style. Specializing in off-grid capabilities and premium materials.",
    vanTypes: ["Sprinter", "Transit", "Promaster", "RAM"],
    priceRange: {
      min: 60000,
      max: 180000
    },
    amenities: [
      "Solar Panels",
      "Roof Racks",
      "Pop-top Options",
      "Off-grid Systems",
      "Premium Materials"
    ],
    services: [
      "Custom Builds",
      "Adventure Conversions",
      "Off-grid Systems",
      "Design Consultation"
    ],
    certifications: [],
    leadTime: "3-8 months",
    socialMedia: {
      facebook: "https://www.facebook.com/mangovans/",
      instagram: "https://www.instagram.com/mangovans/",
      youtube: "https://www.youtube.com/@mangovans"
    },
    gallery: []
  },
  {
    name: "Van Conversion Shop",
    location: {
      city: "Miramar",
      state: "Florida",
      ...getFloridaCoordinates("Miramar"),
      zip: "33025"
    },
    phone: "(786) 890-2900",
    email: "lorenzo@vanconversionshop.com",
    website: "https://vanconversionshop.com/",
    description: "Luxury Mercedes-Benz Sprinter conversions with over 20 years of experience. Mercedes-Benz authorized upfitter specializing in executive and medical mobile vans.",
    vanTypes: ["Mercedes Sprinter", "Mercedes Metris"],
    priceRange: {
      min: 80000,
      max: 300000
    },
    amenities: [
      "Luxury Seating",
      "Massage Seats",
      "LED Lighting",
      "Espresso Machine",
      "Smart TVs",
      "Sound System"
    ],
    services: [
      "Luxury Conversions",
      "Executive Vans",
      "Medical Mobile Vans",
      "Custom Upholstery"
    ],
    certifications: ["Mercedes-Benz Authorized Upfitter"],
    leadTime: "2-6 months",
    socialMedia: {
      facebook: null,
      instagram: null,
      youtube: null
    },
    gallery: []
  },
  {
    name: "Our Van Quest",
    location: {
      city: "Sarasota",
      state: "Florida",
      ...getFloridaCoordinates("Sarasota"),
      zip: "34237"
    },
    phone: "(941) 302-6684",
    email: "info@ourvanquest.com",
    website: "https://www.ourvanquest.com/",
    description: "Van and school bus conversion specialists offering full builds, partial builds, and project assistance. Expert team handling plumbing, electrical, and mobile business conversions.",
    vanTypes: ["Sprinter", "Transit", "Promaster", "School Bus"],
    priceRange: {
      min: 40000,
      max: 200000
    },
    amenities: [
      "Full Plumbing",
      "Electrical Systems",
      "AC Installation",
      "Custom Layouts",
      "Mobile Business Setup"
    ],
    services: [
      "Full Builds",
      "Partial Builds",
      "Project Assistance",
      "Mobile Business Conversions",
      "Renovation Services"
    ],
    certifications: [],
    leadTime: "3-8 months",
    socialMedia: {
      facebook: null,
      instagram: null,
      youtube: null
    },
    gallery: []
  },
  {
    name: "Modern Times Van Co",
    location: {
      city: "Hudson",
      state: "Florida",
      ...getFloridaCoordinates("Hudson"),
      zip: "34667"
    },
    phone: "(727) 379-4174",
    email: "info@moderntimesvanco.com",
    website: "https://www.moderntimesvanco.com/",
    description: "Luxury adventure van conversions crafted since 2020. Offering personalized layouts including The Voyager, The Driftwood, The Family Van, and The Roamer.",
    vanTypes: ["Mercedes Sprinter", "RAM Promaster", "Ford Transit"],
    priceRange: {
      min: 45000,
      max: 180000
    },
    amenities: [
      "Custom Layouts",
      "Luxury Finishes",
      "Functional Design",
      "Quality Craftsmanship",
      "Personalized Experience"
    ],
    services: [
      "Custom Builds",
      "Luxury Conversions",
      "Design Consultation",
      "Personalized Layouts"
    ],
    certifications: [],
    leadTime: "4-10 months",
    socialMedia: {
      facebook: "https://www.facebook.com/moderntimesvans/",
      instagram: "https://www.instagram.com/moderntimesvanco/",
      youtube: "https://www.youtube.com/@ShelbyandSteven"
    },
    gallery: []
  }
];

try {
  // Read builders.json
  console.log('📖 Reading builders.json...');
  const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
  
  // Remove fake Florida builders
  console.log('🗑️  Removing fake Florida builders...');
  const fakeBuilderNames = ["Sunshine State Vans", "Gulf Coast Van Builders"];
  let removedCount = 0;
  
  for (let i = buildersData.length - 1; i >= 0; i--) {
    const builder = buildersData[i];
    if (builder.location.state === "Florida" && fakeBuilderNames.includes(builder.name)) {
      const removed = buildersData.splice(i, 1)[0];
      console.log(`   ✅ Removed fake builder: ${removed.name} (ID: ${removed.id})`);
      removedCount++;
    }
  }
  
  // Find the highest existing ID
  const maxId = Math.max(...buildersData.map(builder => builder.id));
  console.log(`📊 Highest existing ID: ${maxId}`);
  
  // Add authentic Florida builders
  console.log('\n➕ Adding authentic Florida builders...');
  let nextId = maxId + 1;
  
  authenticBuilders.forEach(builderData => {
    const newBuilder = {
      id: nextId,
      ...builderData
    };
    
    buildersData.push(newBuilder);
    console.log(`   ✅ Added: ${newBuilder.name} (ID: ${nextId})`);
    console.log(`      📍 ${newBuilder.location.city}, ${newBuilder.location.state}`);
    console.log(`      📞 ${newBuilder.phone}`);
    console.log(`      🌐 ${newBuilder.website}`);
    nextId++;
  });
  
  // Write updated builders.json
  fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
  console.log('\n💾 Updated builders.json');
  
  // Read builders-by-state.json
  console.log('\n📖 Reading builders-by-state.json...');
  const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
  
  // Remove fake Florida builders from state data
  if (buildersByStateData.Florida) {
    console.log('🗑️  Removing fake builders from Florida state data...');
    const originalCount = buildersByStateData.Florida.length;
    buildersByStateData.Florida = buildersByStateData.Florida.filter(builder => 
      !fakeBuilderNames.includes(builder.name)
    );
    const removedFromState = originalCount - buildersByStateData.Florida.length;
    console.log(`   ✅ Removed ${removedFromState} fake builders from state data`);
  }
  
  // Add authentic builders to state data
  console.log('\n➕ Adding authentic builders to Florida state data...');
  if (!buildersByStateData.Florida) {
    buildersByStateData.Florida = [];
  }
  
  // Create simplified state data entries
  const stateBuilders = buildersData
    .filter(builder => builder.location.state === "Florida")
    .map(builder => ({
      id: builder.id,
      name: builder.name,
      address: `${builder.location.city}, ${builder.location.state}`,
      location: builder.location,
      phone: builder.phone,
      email: builder.email,
      website: builder.website,
      description: builder.description,
      vanTypes: builder.vanTypes,
      priceRange: builder.priceRange,
      amenities: builder.amenities,
      services: builder.services,
      certifications: builder.certifications,
      leadTime: builder.leadTime,
      socialMedia: builder.socialMedia,
      gallery: builder.gallery
    }));
  
  buildersByStateData.Florida = stateBuilders;
  console.log(`   ✅ Added ${stateBuilders.length} authentic builders to Florida state data`);
  
  // Write updated builders-by-state.json
  fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
  console.log('💾 Updated builders-by-state.json');
  
  console.log('\n✅ Florida builders update completed successfully!');
  console.log('\n📊 FLORIDA SUMMARY:');
  console.log(`   • Fake builders removed: ${removedCount}`);
  console.log(`   • Authentic builders added: ${authenticBuilders.length}`);
  console.log(`   • Final Florida builder count: ${stateBuilders.length}`);
  
  console.log('\n🏢 AUTHENTIC FLORIDA BUILDERS ADDED:');
  authenticBuilders.forEach((builder, index) => {
    console.log(`   ${index + 1}. ${builder.name}`);
    console.log(`      📍 ${builder.location.city}, FL`);
    console.log(`      📞 ${builder.phone}`);
    console.log(`      🌐 ${builder.website}`);
  });
  
} catch (error) {
  console.error('❌ Error processing files:', error.message);
  process.exit(1);
}
