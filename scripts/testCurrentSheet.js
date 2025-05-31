/**
 * 🧪 Test Current Google Sheet Data
 * 
 * This checks exactly what's in your current Google Sheet
 */

require('dotenv').config();
const axios = require('axios');

const GOOGLE_SHEETS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const SHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M'; // From your app

async function testCurrentSheet() {
  console.log('🧪 TESTING YOUR CURRENT GOOGLE SHEET');
  console.log('='.repeat(50));
  console.log(`📊 Sheet ID: ${SHEET_ID}`);
  console.log(`🔑 API Key: ${GOOGLE_SHEETS_API_KEY ? 'Found' : 'Missing'}`);
  
  // First, get sheet metadata to see available sheets
  try {
    console.log('\n🔍 Getting sheet metadata...');
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const metadataResponse = await axios.get(metadataUrl);
    
    if (metadataResponse.data.sheets) {
      const sheetNames = metadataResponse.data.sheets.map(sheet => sheet.properties.title);
      console.log('📑 Available sheets:', sheetNames);
      
      // Try each sheet
      for (const sheetName of sheetNames) {
        await testSheetData(sheetName);
      }
    }
    
  } catch (error) {
    console.error('❌ Error getting metadata:', error.message);
    
    // Try default sheet names
    const defaultSheets = ['Sheet1', 'builders', 'USA_van_builders'];
    for (const sheetName of defaultSheets) {
      await testSheetData(sheetName);
    }
  }
}

async function testSheetData(sheetName) {
  console.log(`\n📋 Testing sheet: "${sheetName}"`);
  console.log('-'.repeat(30));
  
  try {
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await axios.get(sheetUrl);
    
    if (response.data.values && response.data.values.length > 0) {
      console.log(`✅ Found data! ${response.data.values.length} rows`);
      
      // Show headers
      console.log('📊 Headers:', response.data.values[0]);
      
      // Show first few data rows
      const dataRows = response.data.values.slice(1, 4); // First 3 data rows
      dataRows.forEach((row, index) => {
        console.log(`   Row ${index + 1}:`, row.slice(0, 3).join(' | '), '...');
      });
      
      // Count by state if possible
      const headers = response.data.values[0];
      const stateIndex = headers.findIndex(h => h && h.toLowerCase().includes('state'));
      
      if (stateIndex !== -1) {
        const states = {};
        response.data.values.slice(1).forEach(row => {
          const state = row[stateIndex] || 'Unknown';
          states[state] = (states[state] || 0) + 1;
        });
        
        console.log('🗺️  Builders by state:');
        Object.entries(states).forEach(([state, count]) => {
          console.log(`     ${state}: ${count}`);
        });
      }
      
      // Check for coordinates
      const latIndex = headers.findIndex(h => h && h.toLowerCase().includes('lat'));
      const lngIndex = headers.findIndex(h => h && (h.toLowerCase().includes('lng') || h.toLowerCase().includes('lon')));
      
      if (latIndex !== -1 && lngIndex !== -1) {
        let validCoords = 0;
        response.data.values.slice(1).forEach(row => {
          const lat = parseFloat(row[latIndex]);
          const lng = parseFloat(row[lngIndex]);
          if (!isNaN(lat) && !isNaN(lng)) {
            validCoords++;
          }
        });
        console.log(`📍 Valid coordinates: ${validCoords}/${response.data.values.length - 1}`);
      } else {
        console.log('⚠️  No coordinate columns found');
      }
      
    } else {
      console.log('❌ No data found');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}`);
  }
}

// Run the test
if (require.main === module) {
  testCurrentSheet()
    .then(() => {
      console.log('\n✅ Sheet test complete!');
    })
    .catch(error => {
      console.error('❌ Test failed:', error.message);
    });
}

module.exports = { testCurrentSheet };
