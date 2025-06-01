const fs = require('fs');

// Load extracted photos
const extractedPhotos = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/colorado-extracted-photos.json', 'utf8'));

// Update builders.json
function updateBuildersGalleries() {
  console.log('📸 Updating galleries in builders.json...');
  
  const buildersData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', 'utf8'));
  
  // Update each Colorado builder's gallery
  Object.entries(extractedPhotos).forEach(([builderName, data]) => {
    const builder = buildersData.find(b => b.id === data.id);
    if (builder) {
      builder.gallery = data.photos;
      console.log(`   ✅ Updated ${builderName}: ${data.photos.length} photos`);
    } else {
      console.log(`   ❌ Builder not found: ${builderName} (ID: ${data.id})`);
    }
  });
  
  // Save updated builders.json
  fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', JSON.stringify(buildersData, null, 2));
  console.log('✅ builders.json updated successfully');
}

// Update builders-by-state.json
function updateBuildersByStateGalleries() {
  console.log('\n📸 Updating galleries in builders-by-state.json...');
  
  const buildersByState = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', 'utf8'));
  
  // Update Colorado builders
  if (buildersByState.Colorado) {
    Object.entries(extractedPhotos).forEach(([builderName, data]) => {
      const builder = buildersByState.Colorado.find(b => b.id === data.id);
      if (builder) {
        builder.gallery = data.photos;
        console.log(`   ✅ Updated ${builderName}: ${data.photos.length} photos`);
      } else {
        console.log(`   ❌ Builder not found: ${builderName} (ID: ${data.id})`);
      }
    });
  }
  
  // Save updated builders-by-state.json
  fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', JSON.stringify(buildersByState, null, 2));
  console.log('✅ builders-by-state.json updated successfully');
}

// Run updates
console.log('🚀 Starting gallery updates for Colorado builders...\n');

updateBuildersGalleries();
updateBuildersByStateGalleries();

console.log('\n📊 GALLERY UPDATE SUMMARY:');
Object.entries(extractedPhotos).forEach(([name, data]) => {
  console.log(`   ${name}: ${data.photoCount} photos added to gallery`);
});

console.log('\n✅ All Colorado builder galleries updated successfully!');
