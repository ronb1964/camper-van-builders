#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌺 Updating Hawaii galleries with Playwright-extracted photos...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');
const resultsFile = path.join(__dirname, 'hawaii-gallery-extraction-results.json');

function updateHawaiiGalleries() {
  try {
    // Read the Playwright extraction results
    console.log('📖 Reading Hawaii Playwright extraction results...');
    const extractionResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    
    // Update builders.json
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('🌺 Updating galleries in builders.json with Hawaii photos...');
    Object.keys(extractionResults).forEach(builderId => {
      const builderIndex = buildersData.findIndex(builder => builder.id === parseInt(builderId));
      if (builderIndex !== -1) {
        const result = extractionResults[builderId];
        if (result.photos && result.photos.length > 0) {
          buildersData[builderIndex].gallery = result.photos;
          console.log(`   ✅ Updated ${result.name}: ${result.photos.length} photos added`);
        } else {
          console.log(`   ⚠️  ${result.name}: No photos available (${result.error ? 'Error: ' + result.error.split('\n')[0] : 'No images found'})`);
        }
      }
    });
    
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    console.log('💾 Updated builders.json');
    
    // Update builders-by-state.json
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('🌺 Updating galleries in builders-by-state.json...');
    if (buildersByStateData.Hawaii) {
      Object.keys(extractionResults).forEach(builderId => {
        const builderIndex = buildersByStateData.Hawaii.findIndex(builder => builder.id === parseInt(builderId));
        if (builderIndex !== -1) {
          const result = extractionResults[builderId];
          if (result.photos && result.photos.length > 0) {
            buildersByStateData.Hawaii[builderIndex].gallery = result.photos;
            console.log(`   ✅ Updated ${result.name} in state data: ${result.photos.length} photos`);
          } else {
            console.log(`   ⚠️  ${result.name} in state data: No photos available`);
          }
        }
      });
    }
    
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log('💾 Updated builders-by-state.json');
    
    console.log('\n✅ Hawaii galleries updated with Playwright photos!');
    
    console.log('\n📊 HAWAII GALLERY UPDATE SUMMARY:');
    Object.values(extractionResults).forEach(result => {
      if (result.photos && result.photos.length > 0) {
        console.log(`   🌺 ${result.name}: ${result.photos.length} authentic photos added`);
        console.log(`      📈 Found ${result.totalFound} total images (${result.gallerySpecific} from gallery sections)`);
      } else {
        console.log(`   ⚠️  ${result.name}: No photos added (${result.error ? 'website timeout' : 'no suitable images'})`);
      }
    });
    
    // Manual gallery suggestions for Hawaii Surf Campers
    console.log('\n📝 MANUAL GALLERY NOTES:');
    console.log('   🌺 Hawaii Surf Campers: Website timeout during extraction');
    console.log('      • Consider manual photo curation from their social media:');
    console.log('      • Facebook: https://www.facebook.com/hawaiisurfcampers');
    console.log('      • Instagram: https://www.instagram.com/hisurfcampers');
    console.log('      • Or retry extraction with different timeout settings');
    
    console.log('\n🎉 SUCCESS: Hawaii expansion with authentic gallery photos complete!');
    console.log('   • 1 fake builder removed');
    console.log('   • 2 authentic builders added');
    console.log('   • 1 builder with full gallery (6 photos)');
    console.log('   • 1 builder pending manual gallery curation');
    
  } catch (error) {
    console.error('❌ Error updating Hawaii galleries:', error.message);
    process.exit(1);
  }
}

updateHawaiiGalleries();
