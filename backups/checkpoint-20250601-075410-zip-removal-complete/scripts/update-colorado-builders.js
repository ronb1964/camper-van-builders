const fs = require('fs');

// New Colorado builders to replace fake ones
const newColoradoBuilders = [
  {
    "id": 20,
    "name": "The Vansmith",
    "address": "Boulder, Colorado",
    "location": {
      "city": "Boulder",
      "state": "Colorado",
      "lat": 40.0150,
      "lng": -105.2705,
      "zip": null
    },
    "phone": null,
    "email": null,
    "website": "https://thevansmith.com/",
    "description": "Family-owned Colorado van conversion company based in Boulder. Team of climbers, hikers, bikers, skiers, campers and nature-lovers with nearly a decade of experience building functional, durable, and beautiful vans.",
    "vanTypes": [
      "Sprinter",
      "Transit"
    ],
    "priceRange": {
      "min": 80000,
      "max": 200000
    },
    "amenities": [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Heating",
      "Custom Storage"
    ],
    "services": [
      "Custom Builds",
      "Consultation",
      "Design Services"
    ],
    "certifications": [],
    "leadTime": "6-12 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/TheVansmithCO/",
      "instagram": "https://www.instagram.com/the_vansmith/",
      "youtube": null
    },
    "gallery": []
  },
  {
    "id": 21,
    "name": "Titan Vans",
    "address": "1901 Central Ave, Boulder, Colorado 80301",
    "location": {
      "city": "Boulder",
      "state": "Colorado",
      "lat": 40.0150,
      "lng": -105.2705,
      "zip": "80301"
    },
    "phone": null,
    "email": null,
    "website": "https://www.titanvans.com/",
    "description": "High quality camper vans designed for ultimate utility and ruggedness. Most components manufactured in-house in Boulder facility. Features EX3 electrical system for 4-season functionality.",
    "vanTypes": [
      "Sprinter",
      "Transit"
    ],
    "priceRange": {
      "min": 70000,
      "max": 180000
    },
    "amenities": [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Heating",
      "EX3 Electrical System"
    ],
    "services": [
      "Custom Builds",
      "Pre-Built Vans",
      "Service & Upgrades",
      "Used Vans"
    ],
    "certifications": [
      "3 Year / 36,000 Mile Warranty"
    ],
    "leadTime": "3-8 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/titanvans/",
      "instagram": "https://www.instagram.com/titanvans/",
      "youtube": "https://www.youtube.com/titanvans"
    },
    "gallery": []
  },
  {
    "id": 22,
    "name": "Boulder Campervans",
    "address": "Boulder, Colorado",
    "location": {
      "city": "Boulder",
      "state": "Colorado",
      "lat": 40.0150,
      "lng": -105.2705,
      "zip": null
    },
    "phone": "(303) 539-6996",
    "email": null,
    "website": "https://www.bouldercampervans.com/",
    "description": "Completely custom, highly detailed camper van conversion company. Team of artists, adventurers, innovators, and perfectionists creating one-of-a-kind camper vans.",
    "vanTypes": [
      "Sprinter",
      "Transit",
      "Promaster"
    ],
    "priceRange": {
      "min": 75000,
      "max": 200000
    },
    "amenities": [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Custom Storage",
      "Power Systems"
    ],
    "services": [
      "Custom Builds",
      "RV Modifications",
      "Power System Upgrades",
      "Service Department"
    ],
    "certifications": [],
    "leadTime": "6-12 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/BoulderCampervans/",
      "instagram": "https://www.instagram.com/bouldercampervans/",
      "youtube": null
    },
    "gallery": []
  },
  {
    "id": 23,
    "name": "Viking Van Customs",
    "address": "3768 Norwood Dr UNIT F, Littleton, Colorado 80125",
    "location": {
      "city": "Littleton",
      "state": "Colorado",
      "lat": 39.6133,
      "lng": -105.0178,
      "zip": "80125"
    },
    "phone": "(720) 655-1186",
    "email": null,
    "website": "https://vikingvancustoms.com/",
    "description": "Premier builder of luxury, high-quality custom camper van conversions. Specializes in one-of-a-kind Mercedes Sprinter, Ford Transit, and Ram ProMaster vehicles for the ultimate VanLife experience.",
    "vanTypes": [
      "Sprinter",
      "Transit",
      "Promaster"
    ],
    "priceRange": {
      "min": 90000,
      "max": 250000
    },
    "amenities": [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Air Conditioning",
      "Heated Floors",
      "Custom Electrical"
    ],
    "services": [
      "Custom Builds",
      "Luxury Conversions",
      "Electrical Systems",
      "Design Consultation"
    ],
    "certifications": [],
    "leadTime": "8-16 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/vikingvancustoms/",
      "instagram": "https://www.instagram.com/vikingvancustoms/",
      "youtube": null
    },
    "gallery": []
  },
  {
    "id": 24,
    "name": "Flippin Vans",
    "address": "Denver, Colorado",
    "location": {
      "city": "Denver",
      "state": "Colorado",
      "lat": 39.7392,
      "lng": -104.9903,
      "zip": null
    },
    "phone": null,
    "email": null,
    "website": "https://www.flippinvans.com/",
    "description": "Professional, affordable, custom van conversions. Specializes in partial builds, repairs, solar, electrical, plumbing, heaters. One-stop-shop for van needs with custom cabinets and handcrafted solutions.",
    "vanTypes": [
      "Sprinter",
      "Transit",
      "Promaster"
    ],
    "priceRange": {
      "min": 40000,
      "max": 120000
    },
    "amenities": [
      "Solar Power",
      "Kitchen",
      "Heating",
      "Custom Cabinets",
      "Electrical Systems"
    ],
    "services": [
      "Full Conversions",
      "Partial Conversions",
      "Specialty Projects",
      "Repairs",
      "Solar Installs"
    ],
    "certifications": [],
    "leadTime": "3-6 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/FlippinVans/",
      "instagram": "https://www.instagram.com/flippinvans/",
      "youtube": null
    },
    "gallery": []
  }
];

async function updateColoradoBuilders() {
  try {
    console.log('🔄 Starting Colorado builders update...');
    
    // Update builders.json
    console.log('📝 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', 'utf8'));
    
    // Find and remove fake Colorado builders (IDs 20 and 21)
    const filteredBuilders = buildersData.filter(builder => 
      !(builder.id === 20 || builder.id === 21)
    );
    
    // Find insertion point (before any builder with ID > 21)
    const insertIndex = filteredBuilders.findIndex(builder => builder.id > 21);
    const actualInsertIndex = insertIndex === -1 ? filteredBuilders.length : insertIndex;
    
    // Insert new Colorado builders
    filteredBuilders.splice(actualInsertIndex, 0, ...newColoradoBuilders);
    
    // Update subsequent builder IDs
    let currentId = 25;
    for (let i = actualInsertIndex + newColoradoBuilders.length; i < filteredBuilders.length; i++) {
      filteredBuilders[i].id = currentId++;
    }
    
    console.log('💾 Saving updated builders.json...');
    fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', JSON.stringify(filteredBuilders, null, 2));
    
    // Update builders-by-state.json
    console.log('📝 Reading builders-by-state.json...');
    const stateData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', 'utf8'));
    
    // Update Colorado section
    stateData.Colorado = newColoradoBuilders;
    
    console.log('💾 Saving updated builders-by-state.json...');
    fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', JSON.stringify(stateData, null, 2));
    
    console.log('✅ Colorado builders update completed successfully!');
    console.log(`📊 Added ${newColoradoBuilders.length} verified Colorado builders:`);
    newColoradoBuilders.forEach(builder => {
      console.log(`   - ${builder.name} (${builder.location.city})`);
    });
    
    console.log('\n🔍 Next steps:');
    console.log('1. Extract authentic photos using Puppeteer script');
    console.log('2. Update CSP with new image domains');
    console.log('3. Test frontend rendering');
    
  } catch (error) {
    console.error('❌ Error updating Colorado builders:', error);
  }
}

updateColoradoBuilders();
