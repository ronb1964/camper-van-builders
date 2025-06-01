require('dotenv').config();
const { getBuildersByState } = require('./src/services/googleSheetsService.ts');

async function verifyGalleryDataFlow() {
  try {
    console.log('🔍 Verifying gallery data flow from Google Sheets to React components...');
    
    // 1. Fetch data from Google Sheets
    console.log('\n📊 Step 1: Fetching data from Google Sheets...');
    const buildersByState = await getBuildersByState();
    
    // 2. Check New Jersey builders
    const newJerseyBuilders = buildersByState['New Jersey'] || [];
    console.log(`✅ Found ${newJerseyBuilders.length} New Jersey builders`);
    
    // 3. Check our target builders
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const targetName of targetBuilders) {
      console.log(`\n🎯 Checking ${targetName}:`);
      
      const builder = newJerseyBuilders.find(b => 
        b.name.includes(targetName) || 
        b.name.includes(targetName.replace(/\./g, ''))
      );
      
      if (builder) {
        console.log(`  ✅ Found: ${builder.name}`);
        console.log(`  📍 Location: ${builder.location}`);
        console.log(`  🖼️ Gallery photos: ${builder.gallery?.length || 0}`);
        
        if (builder.gallery && builder.gallery.length > 0) {
          builder.gallery.forEach((photo, index) => {
            console.log(`    Photo ${index + 1}: ${photo.substring(0, 60)}...`);
          });
          
          // Verify the photo URLs are valid
          const validPhotos = builder.gallery.filter(photo => 
            photo.startsWith('https://') && photo.includes('unsplash.com')
          );
          console.log(`  ✅ Valid photo URLs: ${validPhotos.length}/${builder.gallery.length}`);
        } else {
          console.log(`  ❌ No gallery photos found`);
        }
        
        // Check social media data
        if (builder.socialMedia) {
          const socialCount = Object.values(builder.socialMedia).filter(url => url && url.trim()).length;
          console.log(`  📱 Social media links: ${socialCount}`);
        }
      } else {
        console.log(`  ❌ Builder not found`);
      }
    }
    
    // 4. Summary
    console.log('\n📋 Summary:');
    console.log(`✅ Total builders in New Jersey: ${newJerseyBuilders.length}`);
    
    const buildersWithGallery = newJerseyBuilders.filter(b => b.gallery && b.gallery.length > 0);
    console.log(`✅ Builders with gallery photos: ${buildersWithGallery.length}`);
    
    const totalPhotos = newJerseyBuilders.reduce((sum, b) => sum + (b.gallery?.length || 0), 0);
    console.log(`✅ Total gallery photos: ${totalPhotos}`);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Open the browser preview at http://localhost:3000');
    console.log('2. Click on VanDoIt, Humble Road, or Ready.Set.Van builder cards');
    console.log('3. In the modal, click on the "Gallery" tab');
    console.log('4. Verify that 2 photos are displayed for each builder');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyGalleryDataFlow();
