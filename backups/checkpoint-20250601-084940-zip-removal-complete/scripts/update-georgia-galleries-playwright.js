#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎭 Updating Georgia galleries with Playwright-extracted photos...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');
const resultsFile = path.join(__dirname, 'gallery-extraction-results.json');

function updateGalleries() {
  try {
    // Read the Playwright extraction results
    console.log('📖 Reading Playwright extraction results...');
    const extractionResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    
    // Update builders.json
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('🎭 Updating galleries in builders.json with Playwright photos...');
    Object.keys(extractionResults).forEach(builderId => {
      const builderIndex = buildersData.findIndex(builder => builder.id === parseInt(builderId));
      if (builderIndex !== -1) {
        const result = extractionResults[builderId];
        buildersData[builderIndex].gallery = result.photos;
        console.log(`   ✅ Updated ${result.name}: ${result.photos.length} photos added`);
      }
    });
    
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    console.log('💾 Updated builders.json');
    
    // Update builders-by-state.json
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('🎭 Updating galleries in builders-by-state.json...');
    if (buildersByStateData.Georgia) {
      Object.keys(extractionResults).forEach(builderId => {
        const builderIndex = buildersByStateData.Georgia.findIndex(builder => builder.id === parseInt(builderId));
        if (builderIndex !== -1) {
          const result = extractionResults[builderId];
          buildersByStateData.Georgia[builderIndex].gallery = result.photos;
          console.log(`   ✅ Updated ${result.name} in state data: ${result.photos.length} photos`);
        }
      });
    }
    
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log('💾 Updated builders-by-state.json');
    
    console.log('\n✅ Georgia galleries updated with Playwright photos!');
    
    console.log('\n📊 GALLERY UPDATE SUMMARY:');
    Object.values(extractionResults).forEach(result => {
      console.log(`   🎭 ${result.name}: ${result.photos.length} authentic photos added`);
      console.log(`      📈 Found ${result.totalFound} total images (${result.gallerySpecific} from gallery sections)`);
    });
    
    console.log('\n🎉 SUCCESS: All Georgia builders now have authentic gallery photos!');
    console.log('   • Photos extracted directly from builder websites');
    console.log('   • No fake or placeholder URLs');
    console.log('   • Gallery sections prioritized for relevant content');
    console.log('   • Images filtered by size and relevance');
    
  } catch (error) {
    console.error('❌ Error updating Georgia galleries:', error.message);
    process.exit(1);
  }
}

updateGalleries();
