require('dotenv').config();
const { createSheetsClient, getBuilders, updateBuilderData } = require('./enrich-builder-data.js');

async function updatePhotosWithUrls() {
  try {
    console.log('📸 Updating Google Sheet with real photo URLs...');
    
    const sheets = await createSheetsClient();
    const builders = await getBuilders(sheets);
    
    // Find the Photos column index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'builders!1:1',
    });
    
    const headers = response.data.values[0];
    const photosColumnIndex = headers.indexOf('Photos');
    
    if (photosColumnIndex === -1) {
      console.log('❌ Photos column not found');
      return;
    }
    
    // Real photo URLs from Unsplash for demonstration
    const photoUrls = {
      'VanDoIt': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop,https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      'Humble Road': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop,https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
      'Ready.Set.Van': 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=300&fit=crop,https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    };
    
    for (const builder of builders) {
      if (photoUrls[builder.name]) {
        console.log(`📸 Updating photos for ${builder.name}...`);
        
        await updateBuilderData(sheets, builder.rowIndex, photosColumnIndex, photoUrls[builder.name]);
        console.log(`  ✅ Updated with photo URLs`);
        
        // Add delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n🎉 Photo URLs updated in Google Sheet!');
    console.log('The app will now display real photos in the gallery.');
    
  } catch (error) {
    console.error('Error updating photos:', error);
  }
}

updatePhotosWithUrls();
