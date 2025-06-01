const fs = require('fs');

console.log('🖼️  Updating Connecticut galleries with extracted photos...');

// Load extracted photos
const extractedPhotos = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/connecticut-extracted-photos.json', 'utf8'));

function updateConnecticutGalleries() {
  // Update builders.json
  console.log('📝 Updating builders.json...');
  const buildersData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', 'utf8'));
  
  let updatedCount = 0;
  
  for (let builder of buildersData) {
    if (builder.location.state === 'Connecticut') {
      const builderName = builder.name;
      
      if (extractedPhotos[builderName] && extractedPhotos[builderName].length > 0) {
        builder.gallery = extractedPhotos[builderName];
        console.log(`   ✅ Updated ${builderName}: ${builder.gallery.length} photos`);
        updatedCount++;
      } else {
        console.log(`   ⚠️  No photos found for ${builderName}`);
      }
    }
  }
  
  fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', JSON.stringify(buildersData, null, 2));
  console.log(`   📊 Updated ${updatedCount} Connecticut builders in builders.json`);
  
  // Update builders-by-state.json
  console.log('📝 Updating builders-by-state.json...');
  const buildersByState = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', 'utf8'));
  
  if (buildersByState.Connecticut) {
    let stateUpdatedCount = 0;
    
    for (let builder of buildersByState.Connecticut) {
      const builderName = builder.name;
      
      if (extractedPhotos[builderName] && extractedPhotos[builderName].length > 0) {
        builder.gallery = extractedPhotos[builderName];
        console.log(`   ✅ Updated ${builderName}: ${builder.gallery.length} photos`);
        stateUpdatedCount++;
      }
    }
    
    fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', JSON.stringify(buildersByState, null, 2));
    console.log(`   📊 Updated ${stateUpdatedCount} Connecticut builders in builders-by-state.json`);
  } else {
    console.log('   ⚠️  No Connecticut section found in builders-by-state.json');
  }
  
  console.log('\n✅ Gallery updates completed!');
  
  // Show summary
  console.log('\n📊 Connecticut Gallery Summary:');
  for (const [builderName, photos] of Object.entries(extractedPhotos)) {
    console.log(`   ${builderName}: ${photos.length} photos`);
  }
}

updateConnecticutGalleries();
