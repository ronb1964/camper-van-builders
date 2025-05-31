/**
 * 🔍 Debug Current Data
 * 
 * This checks what data your app is currently fetching from Google Sheets
 */

require('dotenv').config();
const axios = require('axios');

// Your Google Sheets configuration (from your app)
const GOOGLE_SHEETS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Your app uses this for sheets too
const SHEET_ID = '1BcJL8Dj_3QQqGGGv7v7v7v7v7v7v7v7v7v7v7v7v7v7'; // We'll need to find this
const SHEET_NAME = 'Sheet1'; // Default name

async function debugGoogleSheetsData() {
  console.log('🔍 DEBUGGING CURRENT GOOGLE SHEETS DATA');
  console.log('='.repeat(50));
  
  console.log('📊 Environment Check:');
  console.log(`✅ Google Maps API Key: ${GOOGLE_SHEETS_API_KEY ? 'Found' : 'Missing'}`);
  
  // Let's check your app's actual Google Sheets configuration
  console.log('\n📋 Checking your app configuration...');
  
  // Read the actual sheets utility to see the configuration
  try {
    const fs = require('fs');
    const sheetsUtilPath = '/home/ron/Dev/Test/camper-van-builders/src/utils/sheetsUtils.ts';
    const sheetsContent = fs.readFileSync(sheetsUtilPath, 'utf8');
    
    // Extract sheet URL or ID from the file
    const urlMatch = sheetsContent.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const idMatch = sheetsContent.match(/spreadsheetId['"]\s*:\s*['"]([a-zA-Z0-9-_]+)['"]/);
    
    if (urlMatch) {
      console.log(`✅ Found Sheet ID from URL: ${urlMatch[1]}`);
      return await fetchSheetData(urlMatch[1]);
    } else if (idMatch) {
      console.log(`✅ Found Sheet ID from config: ${idMatch[1]}`);
      return await fetchSheetData(idMatch[1]);
    } else {
      console.log('❌ Could not find Google Sheets ID in configuration');
      console.log('💡 Let\'s check what your app is actually using...');
      
      // Show relevant parts of the config
      const lines = sheetsContent.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('spreadsheet') || line.includes('sheet') || line.includes('1B')) {
          console.log(`   Line ${index + 1}: ${line.trim()}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error reading sheets config:', error.message);
  }
}

async function fetchSheetData(sheetId) {
  console.log(`\n📊 Fetching data from sheet: ${sheetId}`);
  
  try {
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log(`🔗 Request URL: ${sheetUrl}`);
    
    const response = await axios.get(sheetUrl);
    
    console.log('\n✅ SUCCESS! Here\'s your current data:');
    console.log('='.repeat(40));
    
    if (response.data.values) {
      response.data.values.forEach((row, index) => {
        console.log(`Row ${index}: ${row.join(' | ')}`);
      });
      
      console.log(`\n📊 Total rows: ${response.data.values.length}`);
      
      // Count builders by state
      if (response.data.values.length > 1) {
        const headers = response.data.values[0];
        const stateIndex = headers.findIndex(h => h.toLowerCase().includes('state'));
        
        if (stateIndex !== -1) {
          const states = {};
          response.data.values.slice(1).forEach(row => {
            const state = row[stateIndex] || 'Unknown';
            states[state] = (states[state] || 0) + 1;
          });
          
          console.log('\n🗺️  Builders by State:');
          Object.entries(states).forEach(([state, count]) => {
            console.log(`   ${state}: ${count} builders`);
          });
        }
      }
      
    } else {
      console.log('❌ No data found in the sheet');
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error fetching sheet data:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.error?.message);
    }
  }
}

// Run the debug
if (require.main === module) {
  debugGoogleSheetsData()
    .then(() => {
      console.log('\n✅ Debug complete!');
    })
    .catch(error => {
      console.error('❌ Debug failed:', error.message);
    });
}

module.exports = { debugGoogleSheetsData };
