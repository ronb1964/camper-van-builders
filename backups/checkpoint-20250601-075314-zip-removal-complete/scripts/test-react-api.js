// Test the exact same API call that React is making
async function testReactAPI() {
  try {
    // Simulate the exact same environment as React
    const apiKey = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
    const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/builders!A:L?key=${apiKey}`;
    
    console.log('🔍 Testing React API call...');
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Data received');
    console.log('Rows count:', data.values ? data.values.length : 0);
    
    if (data.values && data.values.length > 1) {
      console.log('Headers:', data.values[0]);
      console.log('First builder:', data.values[1]);
      
      // Test the exact parsing logic
      const builders = [];
      for (let i = 1; i < Math.min(data.values.length, 5); i++) {
        const row = data.values[i];
        if (!row[1]) continue;
        
        const builder = {
          id: i,
          name: row[1] || 'Unknown Builder',
          website: row[4] || '',
          phone: row[5] || '',
          email: row[6] || '',
          socialMedia: {
            youtube: row[8] || '',
            instagram: row[9] || '',
            facebook: row[10] || '',
          }
        };
        
        builders.push(builder);
        console.log(`Builder ${i}:`, builder.name, builder.website ? '✅' : '❌');
      }
      
      console.log(`📊 Successfully parsed ${builders.length} builders`);
    } else {
      console.log('❌ No data or only headers found');
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
}

testReactAPI();
