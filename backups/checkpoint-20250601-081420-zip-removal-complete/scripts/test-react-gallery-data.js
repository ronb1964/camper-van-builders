// Test what data the React app is receiving
const { GoogleSheetsService } = require('./src/services/googleSheetsService.ts');

async function testReactGalleryData() {
  console.log('🧪 Testing React Gallery Data...\n');
  
  try {
    const service = new GoogleSheetsService();
    const buildersByState = await service.getBuildersByState();
    
    console.log('📊 Builders by state structure:', Object.keys(buildersByState));
    
    const njBuilders = buildersByState['New Jersey'] || [];
    console.log(`🏠 Found ${njBuilders.length} New Jersey builders\n`);
    
    // Check the specific builders with gallery data
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    targetBuilders.forEach(targetName => {
      const builder = njBuilders.find(b => b.name.includes(targetName));
      if (builder) {
        console.log(`🔍 ${targetName} data:`, {
          name: builder.name,
          gallery: builder.gallery,
          galleryLength: builder.gallery?.length || 0,
          galleryType: typeof builder.gallery,
          firstPhoto: builder.gallery?.[0] || 'none'
        });
      } else {
        console.log(`❌ ${targetName} not found in builders list`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing React gallery data:', error);
  }
}

testReactGalleryData();
