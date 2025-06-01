#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Georgia builders galleries - removing broken image URLs...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Georgia builder IDs to fix
const georgiaBuilderIds = [94, 95, 96];

function fixGalleries() {
  try {
    // Fix builders.json
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('🔧 Fixing galleries in builders.json...');
    georgiaBuilderIds.forEach(builderId => {
      const builderIndex = buildersData.findIndex(builder => builder.id === builderId);
      if (builderIndex !== -1) {
        const builderName = buildersData[builderIndex].name;
        buildersData[builderIndex].gallery = []; // Empty gallery for now
        console.log(`   ✅ Cleared gallery for ${builderName} (ID: ${builderId})`);
      }
    });
    
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    console.log('💾 Updated builders.json');
    
    // Fix builders-by-state.json
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('🔧 Fixing galleries in builders-by-state.json...');
    if (buildersByStateData.Georgia) {
      georgiaBuilderIds.forEach(builderId => {
        const builderIndex = buildersByStateData.Georgia.findIndex(builder => builder.id === builderId);
        if (builderIndex !== -1) {
          const builderName = buildersByStateData.Georgia[builderIndex].name;
          buildersByStateData.Georgia[builderIndex].gallery = []; // Empty gallery for now
          console.log(`   ✅ Cleared gallery for ${builderName} in state data (ID: ${builderId})`);
        }
      });
    }
    
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log('💾 Updated builders-by-state.json');
    
    console.log('\n✅ Georgia gallery fix completed successfully!');
    console.log('\n📊 GALLERY FIX SUMMARY:');
    console.log('   • All Georgia builders now have empty galleries');
    console.log('   • No more broken image URLs');
    console.log('   • Frontend will no longer attempt to load non-existent images');
    
    console.log('\n💡 NOTE: Gallery photos can be added later when authentic');
    console.log('   images are found from builder websites or social media.');
    
  } catch (error) {
    console.error('❌ Error fixing Georgia galleries:', error.message);
    process.exit(1);
  }
}

fixGalleries();
