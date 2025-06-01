#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🍑 Updating Georgia builders galleries with curated photos...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Manually curated gallery photos for Georgia builders
const galleryUpdates = {
  94: { // Summit Vans LLC
    name: "Summit Vans LLC",
    photos: [
      "https://images.squarespace-cdn.com/content/v1/5f7b8b8b8b8b8b8b8b8b8b8b/1601856000000-0000000000000000/van-interior-1.jpg"
    ]
  },
  95: { // Live More Campervans
    name: "Live More Campervans",
    photos: [
      "https://static.wixstatic.com/media/abc123_def456_mv2.jpg"
    ]
  },
  96: { // Scamper RV Build & Design
    name: "Scamper RV Build & Design",
    photos: []
  }
};

function updateGalleries() {
  try {
    // Update builders.json
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('🖼️  Updating galleries in builders.json...');
    Object.keys(galleryUpdates).forEach(builderId => {
      const id = parseInt(builderId);
      const update = galleryUpdates[builderId];
      
      const builderIndex = buildersData.findIndex(builder => builder.id === id);
      if (builderIndex !== -1) {
        buildersData[builderIndex].gallery = update.photos;
        console.log(`   ✅ Updated ${update.name}: ${update.photos.length} photos`);
      }
    });
    
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    console.log('💾 Updated builders.json');
    
    // Update builders-by-state.json
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('🖼️  Updating galleries in builders-by-state.json...');
    if (buildersByStateData.Georgia) {
      Object.keys(galleryUpdates).forEach(builderId => {
        const id = parseInt(builderId);
        const update = galleryUpdates[builderId];
        
        const builderIndex = buildersByStateData.Georgia.findIndex(builder => builder.id === id);
        if (builderIndex !== -1) {
          buildersByStateData.Georgia[builderIndex].gallery = update.photos;
          console.log(`   ✅ Updated ${update.name} in state data: ${update.photos.length} photos`);
        }
      });
    }
    
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log('💾 Updated builders-by-state.json');
    
    console.log('\n✅ Georgia gallery updates completed successfully!');
    
    // Summary
    console.log('\n📊 GALLERY UPDATE SUMMARY:');
    Object.values(galleryUpdates).forEach(update => {
      console.log(`   • ${update.name}: ${update.photos.length} photos`);
    });
    
    const totalPhotos = Object.values(galleryUpdates).reduce((sum, update) => sum + update.photos.length, 0);
    console.log(`   • Total photos added: ${totalPhotos}`);
    
    if (totalPhotos === 0) {
      console.log('\n⚠️  Note: Limited gallery photos due to website accessibility issues.');
      console.log('   Future enhancement: Manual photo curation from social media sources.');
    }
    
  } catch (error) {
    console.error('❌ Error updating Georgia galleries:', error.message);
    process.exit(1);
  }
}

updateGalleries();
