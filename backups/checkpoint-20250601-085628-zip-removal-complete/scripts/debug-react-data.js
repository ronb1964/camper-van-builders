require('dotenv').config();

async function debugReactData() {
  console.log('🔍 Debugging React app data flow...\n');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
  
  if (!apiKey) {
    console.error('❌ API key not found');
    return;
  }
  
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/builders!A:L?key=${apiKey}`;
    
    console.log('📡 Fetching data from Google Sheets...');
    const response = await fetch(url);
    const data = await response.json();
    
    // Simulate the same parsing logic as the React app
    const headers = data.values[0];
    const rows = data.values.slice(1);
    
    console.log('📋 Headers:', headers);
    
    // Find target builders and simulate the parsing
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const builderName of targetBuilders) {
      console.log(`\n🔍 Processing ${builderName}:`);
      
      const row = rows.find(r => r[1] && r[1].toLowerCase().includes(builderName.toLowerCase()));
      
      if (row) {
        console.log(`  📋 Raw row data:`, row);
        
        // Simulate the builder object creation (like in googleSheetsService.ts)
        const builder = {
          state: row[0] || '',
          name: row[1] || '',
          location: row[2] || '',
          description: row[3] || '',
          website: row[4] || '',
          phone: row[5] || '',
          email: row[6] || '',
          services: row[7] || '',
          youtube: row[8] || '',
          instagram: row[9] || '',
          facebook: row[10] || '',
          photos: row[11] || ''
        };
        
        console.log(`  📦 Builder object:`, builder);
        
        // Simulate the parsePhotos logic
        const photosInfo = builder.photos;
        let gallery = [];
        
        if (photosInfo.includes('http')) {
          gallery = photosInfo.split(',').map(url => url.trim());
        }
        
        console.log(`  📸 Gallery array:`, gallery);
        console.log(`  📸 Gallery length:`, gallery.length);
        
        // Test if the URLs are valid
        if (gallery.length > 0) {
          console.log(`  🔗 Testing gallery URLs:`);
          for (let i = 0; i < gallery.length; i++) {
            const url = gallery[i];
            console.log(`    ${i + 1}. ${url}`);
            
            // Test if URL is accessible
            try {
              const testResponse = await fetch(url, { method: 'HEAD' });
              console.log(`       ✅ Status: ${testResponse.status}`);
            } catch (error) {
              console.log(`       ❌ Error: ${error.message}`);
            }
          }
        }
        
        // Simulate the final builder object that would be passed to React components
        const finalBuilder = {
          ...builder,
          gallery: gallery,
          socialMedia: {
            youtube: builder.youtube,
            instagram: builder.instagram,
            facebook: builder.facebook
          }
        };
        
        console.log(`  🎯 Final builder object for React:`, {
          name: finalBuilder.name,
          gallery: finalBuilder.gallery,
          galleryLength: finalBuilder.gallery.length,
          socialMedia: finalBuilder.socialMedia
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugReactData();
