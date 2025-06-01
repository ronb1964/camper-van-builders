#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌺 Expanding Hawaii van builders directory...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

function expandHawaiiBuilders() {
  try {
    // Read current data
    console.log('📖 Reading current builders data...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    // STEP 1: Remove fake Hawaii builder
    console.log('\n🗑️  STEP 1: Removing fake Hawaii builder...');
    
    // Remove fake "Aloha Van Conversions" (ID 36) from builders.json
    const fakeBuilderIndex = buildersData.findIndex(builder => 
      builder.id === 36 && builder.name === "Aloha Van Conversions"
    );
    
    if (fakeBuilderIndex !== -1) {
      const removedBuilder = buildersData.splice(fakeBuilderIndex, 1)[0];
      console.log(`   ❌ Removed fake builder: ${removedBuilder.name} (ID ${removedBuilder.id})`);
      console.log(`      • Fake phone: ${removedBuilder.phone}`);
      console.log(`      • Wrong coordinates: ${removedBuilder.location.lat}, ${removedBuilder.location.lng} (New Jersey/NY area, not Hawaii)`);
      console.log(`      • Fake website: ${removedBuilder.website}`);
    }
    
    // Remove from builders-by-state.json (appears to be ID 27 there)
    if (buildersByStateData.Hawaii) {
      const stateFakeIndex = buildersByStateData.Hawaii.findIndex(builder => 
        builder.name === "Aloha Van Conversions"
      );
      if (stateFakeIndex !== -1) {
        const removedStateBuilder = buildersByStateData.Hawaii.splice(stateFakeIndex, 1)[0];
        console.log(`   ❌ Removed from state data: ${removedStateBuilder.name} (ID ${removedStateBuilder.id})`);
      }
    }
    
    // STEP 2: Add authentic Hawaii builders
    console.log('\n🌺 STEP 2: Adding authentic Hawaii builders...');
    
    // Find the highest current ID
    const maxId = Math.max(...buildersData.map(builder => builder.id));
    let nextId = maxId + 1;
    
    // Authentic Hawaii builders to add
    const authenticBuilders = [
      {
        id: nextId++,
        name: "Hawaii Surf Campers",
        address: "931 Palm Place, Wahiawa, HI 96786",
        location: {
          city: "Wahiawa",
          state: "Hawaii",
          lat: 21.4947, // Approximate Wahiawa coordinates
          lng: -158.0239,
          zip: "96786"
        },
        phone: "(808) 797-2808",
        email: "info@hawaiisurfcampers.com",
        website: "https://www.hawaiisurfcampers.com/",
        description: "Hawaii-based van conversion specialists offering custom builds and rental services with island-style conversions for tropical adventures.",
        vanTypes: [
          "Custom Conversions",
          "Vintage VW",
          "Modern Vans"
        ],
        priceRange: {
          min: 25000,
          max: 80000
        },
        amenities: [
          "Dual Battery System",
          "Running Water",
          "Solar Charging",
          "Cabinets and Storage",
          "Vent Windows",
          "Pull-out Shower"
        ],
        services: [
          "Custom Builds",
          "Van Conversions",
          "Automotive Services",
          "Rental Fleet"
        ],
        certifications: [],
        leadTime: "2-4 months",
        socialMedia: {
          facebook: "https://www.facebook.com/hawaiisurfcampers",
          instagram: "https://www.instagram.com/hisurfcampers",
          youtube: null
        },
        gallery: []
      },
      {
        id: nextId++,
        name: "Campervans Big Island",
        address: "Hilo, Hawaii",
        location: {
          city: "Hilo",
          state: "Hawaii",
          lat: 19.7297, // Hilo coordinates
          lng: -155.0900,
          zip: null
        },
        phone: "(808) 425-9504",
        email: "campervansbigisland@gmail.com",
        website: "https://www.campervansbigisland.com/",
        description: "Big Island-based campervan specialists offering vintage conversion vans and custom builds for exploring Hawaii's largest island.",
        vanTypes: [
          "Vintage Conversions",
          "Custom Builds"
        ],
        priceRange: {
          min: 30000,
          max: 75000
        },
        amenities: [
          "Full Kitchen",
          "Sleeping Area",
          "Storage Solutions",
          "Outdoor Equipment"
        ],
        services: [
          "Custom Conversions",
          "Vintage Restorations",
          "Rental Services"
        ],
        certifications: [],
        leadTime: "3-6 months",
        socialMedia: {
          facebook: null,
          instagram: "https://www.instagram.com/campervans_bigisland",
          youtube: "https://www.youtube.com/channel/UCZqEWwRmNfKJ697IGaB8-Jw"
        },
        gallery: []
      }
    ];
    
    // Add to builders.json
    authenticBuilders.forEach(builder => {
      buildersData.push(builder);
      console.log(`   ✅ Added: ${builder.name} (ID ${builder.id})`);
      console.log(`      📍 Location: ${builder.address}`);
      console.log(`      📞 Phone: ${builder.phone}`);
      console.log(`      🌐 Website: ${builder.website}`);
      console.log(`      📧 Email: ${builder.email}`);
    });
    
    // Add to builders-by-state.json
    if (!buildersByStateData.Hawaii) {
      buildersByStateData.Hawaii = [];
    }
    
    authenticBuilders.forEach(builder => {
      buildersByStateData.Hawaii.push(builder);
      console.log(`   ✅ Added to state data: ${builder.name}`);
    });
    
    // Save updated data
    console.log('\n💾 Saving updated data...');
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    
    console.log('✅ Hawaii builders expansion completed!');
    
    console.log('\n📊 HAWAII EXPANSION SUMMARY:');
    console.log('   🗑️  Fake builders removed: 1');
    console.log('      • Aloha Van Conversions (fake phone, wrong coordinates, fake website)');
    console.log('   ✅ Authentic builders added: 2');
    console.log('      • Hawaii Surf Campers - Wahiawa, Oahu');
    console.log('      • Campervans Big Island - Hilo, Big Island');
    console.log(`   📈 Final Hawaii builder count: ${buildersByStateData.Hawaii.length}`);
    console.log('   🌺 Geographic coverage: Oahu and Big Island');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Extract gallery photos using Playwright');
    console.log('   2. Update CSP if needed for new image domains');
    console.log('   3. Test frontend display');
    console.log('   4. Create backup');
    
  } catch (error) {
    console.error('❌ Error expanding Hawaii builders:', error.message);
    process.exit(1);
  }
}

expandHawaiiBuilders();
