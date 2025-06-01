const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

async function debugGalleryDisplay() {
  console.log('🔍 Debugging gallery display issues...\n');

  try {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet('1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M');
    
    // Authenticate with service account
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    await doc.useServiceAccountAuth(credentials);
    
    // Load document properties and worksheets
    await doc.loadInfo();
    console.log(`📊 Loaded sheet: ${doc.title}`);
    
    const sheet = doc.sheetsByTitle['builders'];
    if (!sheet) {
      console.error('❌ "builders" sheet not found');
      return;
    }
    
    // Get all rows
    const rows = await sheet.getRows();
    console.log(`📋 Found ${rows.length} builders\n`);
    
    // Check the target builders specifically
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const builderName of targetBuilders) {
      console.log(`🔍 Checking ${builderName}:`);
      
      const builder = rows.find(row => 
        row.get('Company Name') && 
        row.get('Company Name').toLowerCase().includes(builderName.toLowerCase())
      );
      
      if (builder) {
        const photos = builder.get('Photos') || '';
        console.log(`  📸 Photos field: "${photos}"`);
        console.log(`  📸 Photos length: ${photos.length}`);
        
        if (photos) {
          const photoUrls = photos.split(',').map(url => url.trim()).filter(url => url);
          console.log(`  📸 Parsed URLs (${photoUrls.length}):`);
          photoUrls.forEach((url, index) => {
            console.log(`    ${index + 1}. ${url}`);
          });
          
          // Test if URLs are accessible
          for (let i = 0; i < photoUrls.length; i++) {
            const url = photoUrls[i];
            try {
              const https = require('https');
              const http = require('http');
              const client = url.startsWith('https:') ? https : http;
              
              await new Promise((resolve, reject) => {
                const req = client.get(url, (res) => {
                  console.log(`    ✅ URL ${i + 1} accessible: ${res.statusCode} ${res.statusMessage}`);
                  resolve();
                }).on('error', (err) => {
                  console.log(`    ❌ URL ${i + 1} error: ${err.message}`);
                  reject(err);
                });
                
                req.setTimeout(5000, () => {
                  console.log(`    ⏰ URL ${i + 1} timeout`);
                  req.destroy();
                  resolve();
                });
              }).catch(() => {});
              
            } catch (error) {
              console.log(`    ❌ URL ${i + 1} test failed: ${error.message}`);
            }
          }
        } else {
          console.log(`  ⚠️ No photos found for ${builderName}`);
        }
        
        console.log(''); // Empty line for readability
      } else {
        console.log(`  ❌ Builder "${builderName}" not found in sheet\n`);
      }
    }
    
    // Check all builders for gallery data
    console.log('\n📊 Gallery data summary for all builders:');
    let buildersWithPhotos = 0;
    let buildersWithoutPhotos = 0;
    
    rows.forEach(row => {
      const name = row.get('Company Name') || 'Unknown';
      const photos = row.get('Photos') || '';
      
      if (photos && photos.trim()) {
        buildersWithPhotos++;
        const photoCount = photos.split(',').filter(url => url.trim()).length;
        console.log(`  ✅ ${name}: ${photoCount} photos`);
      } else {
        buildersWithoutPhotos++;
      }
    });
    
    console.log(`\n📈 Summary:`);
    console.log(`  - Builders with photos: ${buildersWithPhotos}`);
    console.log(`  - Builders without photos: ${buildersWithoutPhotos}`);
    console.log(`  - Total builders: ${rows.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

debugGalleryDisplay();
