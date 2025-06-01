#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🖼️  Updating Florida builder galleries with curated photos...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Manually curated gallery photos for Florida builders
const galleryUpdates = {
  89: [ // Woodpecker Crafts and Builds LLC
    "https://woodpeckercraftsandbuilds.com/wp-content/uploads/2023/02/Untitled-design-11.png"
  ],
  90: [ // Mango Vans - Using placeholder for Instagram-style photos
    "https://images.squarespace-cdn.com/content/v1/63b596be45c8ea33e4ce3f89/1683393128673-Q39DE6UJK752BSFLTPHC/image-asset.jpeg"
  ],
  91: [ // Van Conversion Shop - Mercedes luxury conversions
    // Using generic luxury van conversion photos as placeholders
  ],
  92: [ // Our Van Quest - Sarasota
    // Using generic conversion photos as placeholders
  ],
  93: [ // Modern Times Van Co - Hudson
    // Using generic luxury van photos as placeholders
  ]
};

try {
  // Read builders.json
  console.log('📖 Reading builders.json...');
  const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
  
  // Update galleries for Florida builders
  console.log('🖼️  Updating galleries for Florida builders...');
  let updatedCount = 0;
  
  buildersData.forEach(builder => {
    if (builder.location.state === "Florida" && galleryUpdates[builder.id]) {
      const photos = galleryUpdates[builder.id];
      if (photos.length > 0) {
        builder.gallery = photos;
        console.log(`   ✅ Updated gallery for ${builder.name}: ${photos.length} photos`);
        updatedCount++;
      }
    }
  });
  
  // Write updated builders.json
  fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
  console.log(`💾 Updated builders.json with ${updatedCount} gallery updates`);
  
  // Read and update builders-by-state.json
  console.log('\n📖 Reading builders-by-state.json...');
  const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
  
  if (buildersByStateData.Florida) {
    console.log('🖼️  Updating Florida state data galleries...');
    let stateUpdatedCount = 0;
    
    buildersByStateData.Florida.forEach(builder => {
      if (galleryUpdates[builder.id]) {
        const photos = galleryUpdates[builder.id];
        if (photos.length > 0) {
          builder.gallery = photos;
          console.log(`   ✅ Updated state gallery for ${builder.name}: ${photos.length} photos`);
          stateUpdatedCount++;
        }
      }
    });
    
    // Write updated builders-by-state.json
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log(`💾 Updated builders-by-state.json with ${stateUpdatedCount} gallery updates`);
  }
  
  console.log('\n✅ Florida gallery updates completed!');
  console.log('\n📊 GALLERY UPDATE SUMMARY:');
  
  const floridaBuilders = buildersData.filter(b => b.location.state === "Florida");
  floridaBuilders.forEach(builder => {
    const photoCount = builder.gallery ? builder.gallery.length : 0;
    console.log(`   ${builder.name}: ${photoCount} photos`);
  });
  
  console.log('\n📝 NOTE: Limited photos extracted due to website loading issues.');
  console.log('   Future enhancement: Manual curation of Instagram/social media photos');
  console.log('   for builders with active social media presence.');
  
} catch (error) {
  console.error('❌ Error updating galleries:', error.message);
  process.exit(1);
}
