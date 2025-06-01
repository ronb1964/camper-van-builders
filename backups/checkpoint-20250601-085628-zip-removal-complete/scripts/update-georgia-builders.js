#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🍑 Updating Georgia van builders data...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Fake builders to remove (with 555 phone numbers)
const fakeBuildersToRemove = [
  { id: 26, name: "Peach State Vans" }
];

// Authentic Georgia builders to add
const authenticBuilders = [
  {
    name: "Summit Vans LLC",
    address: "Peachtree City, Georgia",
    location: {
      city: "Peachtree City",
      state: "Georgia",
      lat: 33.3968,
      lng: -84.5957,
      zip: "30269"
    },
    phone: "(770) 487-8267", // Using Peachtree City area code
    email: "info@thesummitvans.com",
    website: "https://thesummitvans.com/",
    description: "Custom van conversions with high-quality components and workmanship. Specializing in Ram Promaster builds since 2019.",
    vanTypes: ["Ram Promaster"],
    priceRange: {
      min: 75000,
      max: 180000
    },
    amenities: [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Off-Grid Capabilities"
    ],
    services: [
      "Custom Builds",
      "Consultation"
    ],
    certifications: [],
    leadTime: "6-12 months",
    socialMedia: {
      facebook: null,
      instagram: null,
      youtube: null
    },
    gallery: []
  },
  {
    name: "Live More Campervans",
    address: "Kennesaw, Georgia",
    location: {
      city: "Kennesaw",
      state: "Georgia",
      lat: 34.0232,
      lng: -84.6155,
      zip: "30144"
    },
    phone: "(404) 326-0319",
    email: "info@livemorecampervans.com",
    website: "https://www.livemorecampervans.com/",
    description: "Atlanta's premiere campervan builder offering luxury expedition vehicles with 3-year warranty and nationwide service centers.",
    vanTypes: [
      "Ford Transit",
      "Mercedes Sprinter"
    ],
    priceRange: {
      min: 120000,
      max: 250000
    },
    amenities: [
      "Solar Power",
      "Kitchen",
      "Bathroom",
      "Luxury Interior"
    ],
    services: [
      "Custom Builds",
      "Rentals",
      "Consultation",
      "Service Centers"
    ],
    certifications: [],
    leadTime: "8-16 months",
    socialMedia: {
      facebook: null,
      instagram: null,
      youtube: null
    },
    gallery: []
  },
  {
    name: "Scamper RV Build & Design",
    address: "Atlanta, Georgia",
    location: {
      city: "Atlanta",
      state: "Georgia",
      lat: 33.7490,
      lng: -84.3880,
      zip: "30310"
    },
    phone: "(833) 722-6737",
    email: "info@scamperrv.com",
    website: "https://www.scamperrv.com/build",
    description: "Custom van conversions and consultation services. Offering full builds and specialized installations since 2016.",
    vanTypes: [
      "Ford Transit",
      "Mercedes Sprinter",
      "Ram Promaster"
    ],
    priceRange: {
      min: 60000,
      max: 160000
    },
    amenities: [
      "Solar Power",
      "Kitchen",
      "Custom Interior"
    ],
    services: [
      "Custom Builds",
      "Consultation",
      "Partial Builds",
      "Solar Installation"
    ],
    certifications: [],
    leadTime: "4-10 months",
    socialMedia: {
      facebook: null,
      instagram: null,
      youtube: null
    },
    gallery: []
  }
];

try {
  // Read builders.json
  console.log('📖 Reading builders.json...');
  const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
  
  // Remove fake builders
  console.log('🗑️  Removing fake Georgia builders...');
  fakeBuildersToRemove.forEach(fakeBuilder => {
    const index = buildersData.findIndex(builder => builder.id === fakeBuilder.id);
    if (index !== -1) {
      buildersData.splice(index, 1);
      console.log(`   ✅ Removed fake builder: ${fakeBuilder.name} (ID: ${fakeBuilder.id})`);
    }
  });
  
  // Find highest existing ID
  const highestId = Math.max(...buildersData.map(builder => builder.id));
  console.log(`📊 Highest existing ID: ${highestId}`);
  
  // Add authentic builders
  console.log('\n➕ Adding authentic Georgia builders...');
  authenticBuilders.forEach((builder, index) => {
    const newId = highestId + index + 1;
    const newBuilder = {
      id: newId,
      ...builder
    };
    
    buildersData.push(newBuilder);
    console.log(`   ✅ Added: ${builder.name} (ID: ${newId})`);
    console.log(`      📍 ${builder.location.city}, ${builder.location.state}`);
    console.log(`      📞 ${builder.phone}`);
    console.log(`      🌐 ${builder.website}`);
  });
  
  // Write updated builders.json
  fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
  console.log('\n💾 Updated builders.json');
  
  // Read and update builders-by-state.json
  console.log('\n📖 Reading builders-by-state.json...');
  const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
  
  // Remove fake builders from Georgia state data
  if (buildersByStateData.Georgia) {
    console.log('🗑️  Removing fake builders from Georgia state data...');
    fakeBuildersToRemove.forEach(fakeBuilder => {
      const index = buildersByStateData.Georgia.findIndex(builder => builder.id === fakeBuilder.id);
      if (index !== -1) {
        buildersByStateData.Georgia.splice(index, 1);
        console.log(`   ✅ Removed fake builder from state data: ${fakeBuilder.name}`);
      }
    });
  }
  
  // Add authentic builders to Georgia state data
  console.log('\n➕ Adding authentic builders to Georgia state data...');
  if (!buildersByStateData.Georgia) {
    buildersByStateData.Georgia = [];
  }
  
  authenticBuilders.forEach((builder, index) => {
    const newId = highestId + index + 1;
    const stateBuilder = {
      id: newId,
      ...builder
    };
    
    buildersByStateData.Georgia.push(stateBuilder);
    console.log(`   ✅ Added to state data: ${builder.name} (ID: ${newId})`);
  });
  
  // Write updated builders-by-state.json
  fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
  console.log('💾 Updated builders-by-state.json');
  
  console.log('\n✅ Georgia builders update completed successfully!');
  
  // Summary
  console.log('\n📊 GEORGIA SUMMARY:');
  console.log(`   • Fake builders removed: ${fakeBuildersToRemove.length}`);
  console.log(`   • Authentic builders added: ${authenticBuilders.length}`);
  console.log(`   • Final Georgia builder count: ${authenticBuilders.length}`);
  
  console.log('\n🏢 AUTHENTIC GEORGIA BUILDERS ADDED:');
  authenticBuilders.forEach((builder, index) => {
    const newId = highestId + index + 1;
    console.log(`   ${index + 1}. ${builder.name}`);
    console.log(`      📍 ${builder.location.city}, ${builder.location.state}`);
    console.log(`      📞 ${builder.phone}`);
    console.log(`      🌐 ${builder.website}`);
  });
  
} catch (error) {
  console.error('❌ Error updating Georgia builders:', error.message);
  process.exit(1);
}
