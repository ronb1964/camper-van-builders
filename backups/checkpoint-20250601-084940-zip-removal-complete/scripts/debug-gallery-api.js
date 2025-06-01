require('dotenv').config();

async function debugGalleryAPI() {
  console.log('🔍 Debugging gallery data via API...\n');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
  
  if (!apiKey) {
    console.error('❌ API key not found in environment variables');
    return;
  }
  
  console.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
  
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/builders!A:L?key=${apiKey}`;
    
    console.log('📡 Fetching data from Google Sheets...');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`❌ API request failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched data`);
    console.log(`📊 Found ${data.values.length} rows (including header)\n`);
    
    // Get headers
    const headers = data.values[0];
    console.log('📋 Headers:', headers);
    
    // Find the Photos column index
    const photosIndex = headers.findIndex(header => 
      header && header.toLowerCase().includes('photo')
    );
    
    if (photosIndex === -1) {
      console.error('❌ Photos column not found in headers');
      return;
    }
    
    console.log(`📸 Photos column found at index ${photosIndex} (${headers[photosIndex]})\n`);
    
    // Check target builders
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const builderName of targetBuilders) {
      console.log(`🔍 Checking ${builderName}:`);
      
      // Find the builder row
      const builderRow = data.values.find(row => 
        row[1] && row[1].toLowerCase().includes(builderName.toLowerCase())
      );
      
      if (builderRow) {
        const photos = builderRow[photosIndex] || '';
        console.log(`  📸 Raw photos data: "${photos}"`);
        console.log(`  📸 Data length: ${photos.length}`);
        console.log(`  📸 Data type: ${typeof photos}`);
        
        if (photos && photos.trim()) {
          const photoUrls = photos.split(',').map(url => url.trim()).filter(url => url);
          console.log(`  📸 Parsed URLs (${photoUrls.length}):`);
          photoUrls.forEach((url, index) => {
            console.log(`    ${index + 1}. ${url}`);
          });
        } else {
          console.log(`  ⚠️ No photos data found`);
        }
        
        console.log(`  📋 Full row data:`, builderRow);
        console.log(''); // Empty line
      } else {
        console.log(`  ❌ Builder "${builderName}" not found\n`);
      }
    }
    
    // Check all builders for photos
    console.log('\n📊 Photo data summary:');
    let buildersWithPhotos = 0;
    let buildersWithoutPhotos = 0;
    
    data.values.slice(1).forEach((row, index) => {
      const name = row[1] || `Row ${index + 2}`;
      const photos = row[photosIndex] || '';
      
      if (photos && photos.trim()) {
        buildersWithPhotos++;
        const photoCount = photos.split(',').filter(url => url.trim()).length;
        console.log(`  ✅ ${name}: ${photoCount} photos`);
      } else {
        buildersWithoutPhotos++;
        console.log(`  ❌ ${name}: no photos`);
      }
    });
    
    console.log(`\n📈 Summary:`);
    console.log(`  - Builders with photos: ${buildersWithPhotos}`);
    console.log(`  - Builders without photos: ${buildersWithoutPhotos}`);
    console.log(`  - Total builders: ${data.values.length - 1}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

debugGalleryAPI();
