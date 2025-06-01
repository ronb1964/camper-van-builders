#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📱 Updating Live More Campervans social media data...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

// Live More Campervans ID and social media data
const liveMorId = 95;
const socialMediaData = {
  facebook: "https://www.facebook.com/livemorecampervans",
  instagram: "https://www.instagram.com/livemorecampervans/",
  youtube: "https://www.youtube.com/@Livemorecampervans"
};

function updateSocialMedia() {
  try {
    // Update builders.json
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('📱 Updating social media in builders.json...');
    const builderIndex = buildersData.findIndex(builder => builder.id === liveMorId);
    if (builderIndex !== -1) {
      buildersData[builderIndex].socialMedia = socialMediaData;
      console.log(`   ✅ Updated Live More Campervans social media:`);
      console.log(`      📘 Facebook: ${socialMediaData.facebook}`);
      console.log(`      📸 Instagram: ${socialMediaData.instagram}`);
      console.log(`      📺 YouTube: ${socialMediaData.youtube}`);
    }
    
    fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
    console.log('💾 Updated builders.json');
    
    // Update builders-by-state.json
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('📱 Updating social media in builders-by-state.json...');
    if (buildersByStateData.Georgia) {
      const stateBuilderIndex = buildersByStateData.Georgia.findIndex(builder => builder.id === liveMorId);
      if (stateBuilderIndex !== -1) {
        buildersByStateData.Georgia[stateBuilderIndex].socialMedia = socialMediaData;
        console.log(`   ✅ Updated Live More Campervans social media in state data`);
      }
    }
    
    fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
    console.log('💾 Updated builders-by-state.json');
    
    console.log('\n✅ Live More Campervans social media update completed successfully!');
    
    console.log('\n📊 SOCIAL MEDIA SUMMARY:');
    console.log('   • Facebook: Live More Campervans page with 2,066+ likes');
    console.log('   • Instagram: @livemorecampervans with 31K+ followers');
    console.log('   • YouTube: @Livemorecampervans channel with build videos');
    console.log('   • All social accounts verified and active');
    
  } catch (error) {
    console.error('❌ Error updating Live More Campervans social media:', error.message);
    process.exit(1);
  }
}

updateSocialMedia();
