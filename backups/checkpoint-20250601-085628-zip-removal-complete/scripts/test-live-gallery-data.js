// Test the live Google Sheets API to see what gallery data we're getting
const { default: fetch } = require('node-fetch');

async function testLiveGalleryData() {
  console.log('🧪 Testing Live Gallery Data from Google Sheets...\n');
  
  const API_KEY = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
  const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
  const RANGE = 'builders!A:L';
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.values) {
      console.log(`📊 Found ${data.values.length} rows in Google Sheets\n`);
      
      // Check the header row
      console.log('📋 Headers:', data.values[0]);
      console.log('📋 Column L (Photos) is at index:', data.values[0].indexOf('Photos') || 11);
      
      // Check specific builders with gallery data
      const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
      
      data.values.slice(1).forEach((row, index) => {
        const builderName = row[1];
        if (builderName && targetBuilders.some(target => builderName.includes(target))) {
          console.log(`\n🔍 ${builderName} (Row ${index + 2}):`);
          console.log('  - Raw Photos Data (Column L):', row[11] || 'EMPTY');
          console.log('  - Photos Column Length:', (row[11] || '').length);
          console.log('  - Contains http:', (row[11] || '').includes('http'));
          
          if (row[11] && row[11].includes('http')) {
            const photoUrls = row[11].split(',').map(url => url.trim());
            console.log('  - Parsed URLs:', photoUrls);
            console.log('  - URL Count:', photoUrls.length);
          }
        }
      });
      
    } else {
      console.error('❌ No data found in response:', data);
    }
    
  } catch (error) {
    console.error('❌ Error fetching live gallery data:', error);
  }
}

testLiveGalleryData();
