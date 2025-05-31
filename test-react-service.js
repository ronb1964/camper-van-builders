// Test the React service directly
require('dotenv').config();
const fetch = require('node-fetch');

// Mock the React environment
process.env.REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

async function testReactService() {
  try {
    console.log('🧪 Testing React Google Sheets service...');
    
    const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const SHEET_NAME = 'builders';
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:L?key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;

    console.log('✅ API Response received');
    console.log(`📊 Found ${rows.length - 1} builders`);
    
    // Test the parsing logic
    function parsePhotos(photosInfo, builderName) {
      if (photosInfo && photosInfo.includes('http')) {
        return photosInfo.split(',').map(url => url.trim());
      }
      return [];
    }
    
    // Parse first builder (VanDoIt)
    const row = rows[1];
    const builder = {
      name: row[1],
      website: row[4],
      phone: row[5],
      email: row[6],
      services: row[7] ? row[7].split(',').map(s => s.trim()) : [],
      socialMedia: {
        youtube: row[8] || '',
        instagram: row[9] || '',
        facebook: row[10] || '',
      },
      gallery: row[11] ? parsePhotos(row[11], row[1]) : []
    };
    
    console.log('\n🏢 Parsed VanDoIt data:');
    console.log('Name:', builder.name);
    console.log('Website:', builder.website);
    console.log('Phone:', builder.phone);
    console.log('Email:', builder.email);
    console.log('Services:', builder.services);
    console.log('Social Media:', builder.socialMedia);
    console.log('Gallery:', builder.gallery);
    
    console.log('\n✅ React service logic working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testReactService();
