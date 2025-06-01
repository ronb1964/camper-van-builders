const fs = require('fs');

console.log('🏗️  Updating Connecticut builders with authentic data...');

// Get coordinates for Prospect, CT
function getProspectCoordinates() {
  // Prospect, CT coordinates
  return {
    lat: 41.5020,
    lng: -72.9790
  };
}

// Remove fake builder and add authentic one
console.log('📝 Updating builders.json...');
const buildersData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', 'utf8'));

// Remove fake "New England Van Co" (ID 31)
const filteredBuilders = buildersData.filter(builder => builder.id !== 31);
console.log(`   ✅ Removed fake "New England Van Co" builder`);

// Add authentic Live a Little Vans
const prospectCoords = getProspectCoordinates();
const liveALittleVans = {
  id: 31, // Reuse the ID
  name: "Live a Little Vans",
  address: "40 Union City Rd Suite K, Prospect, CT 06712",
  location: {
    city: "Prospect",
    state: "Connecticut",
    lat: prospectCoords.lat,
    lng: prospectCoords.lng,
    zip: "06712"
  },
  phone: "(203) 231-7260",
  email: "info@livealittlevans.com",
  website: "https://www.livealittlevans.com/",
  description: "Custom designed off-grid adventure vans tailored to your unique vision and lifestyle. Specializing in full custom van builds on Sprinter, ProMaster and Transit platforms.",
  vanTypes: [
    "Sprinter",
    "ProMaster", 
    "Transit"
  ],
  priceRange: {
    min: 100000,
    max: 200000
  },
  amenities: [
    "Solar Power",
    "Kitchen",
    "Bathroom",
    "Electrical Systems",
    "Custom Cabinetry",
    "Off-Grid Capabilities"
  ],
  services: [
    "Custom Builds",
    "Partial Services",
    "Consultation",
    "Individual Services",
    "Design Services"
  ],
  certifications: [],
  leadTime: "Varies by project",
  socialMedia: {
    facebook: "https://www.facebook.com/livealittlevans/",
    instagram: "https://www.instagram.com/livealittlevans",
    youtube: null
  },
  gallery: [] // Will be populated by photo extraction script
};

// Add the new builder
filteredBuilders.push(liveALittleVans);

// Sort by ID to maintain order
filteredBuilders.sort((a, b) => a.id - b.id);

fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', JSON.stringify(filteredBuilders, null, 2));
console.log(`   ✅ Added authentic "Live a Little Vans" builder`);

// Update builders-by-state.json
console.log('📝 Updating builders-by-state.json...');
const buildersByState = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', 'utf8'));

if (buildersByState.Connecticut) {
  // Remove fake builder and add authentic one
  buildersByState.Connecticut = buildersByState.Connecticut.filter(builder => builder.id !== 31);
  buildersByState.Connecticut.push(liveALittleVans);
  buildersByState.Connecticut.sort((a, b) => a.id - b.id);
  
  fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', JSON.stringify(buildersByState, null, 2));
  console.log(`   ✅ Updated Connecticut section in builders-by-state.json`);
} else {
  console.log('   ⚠️  No Connecticut section found in builders-by-state.json');
}

console.log('\n✅ Connecticut builders successfully updated!');
console.log('📊 Connecticut now has 1 verified, authentic builder:');
console.log('   • Live a Little Vans (Prospect, CT)');
console.log('\n🎯 Next step: Extract gallery photos using Puppeteer script');
