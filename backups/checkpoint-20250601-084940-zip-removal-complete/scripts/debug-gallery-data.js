// Debug gallery data for specific builders
async function debugGalleryData() {
  try {
    console.log('🔍 Debugging gallery data...');
    
    const apiKey = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
    const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/builders!A:L?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;
    
    console.log('📊 Checking gallery data for target builders...');
    
    // Check VanDoIt, Humble Road, and Ready.Set.Van
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const companyName = row[1];
      
      if (targetBuilders.includes(companyName)) {
        console.log(`\n✅ Found ${companyName}:`);
        console.log('  Photos column (L):', row[11]);
        
        // Test parsePhotos logic
        const photosInfo = row[11];
        if (photosInfo && photosInfo.includes('http')) {
          const parsedPhotos = photosInfo.split(',').map(url => url.trim());
          console.log('  Parsed photos:', parsedPhotos);
          console.log('  Photo count:', parsedPhotos.length);
          
          // Test if URLs are accessible
          for (let j = 0; j < parsedPhotos.length; j++) {
            console.log(`  Photo ${j + 1}: ${parsedPhotos[j]}`);
          }
        } else {
          console.log('  ❌ No valid photo URLs found');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugGalleryData();
