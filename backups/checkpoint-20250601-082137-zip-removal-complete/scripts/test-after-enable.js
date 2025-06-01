#!/usr/bin/env node

// Quick test script to verify Google Sheets API is working after enabling
require('dotenv').config();

const SHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('🔍 Testing Google Sheets API after enabling...');

async function quickTest() {
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
    const response = await fetch(metadataUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Google Sheets API is now working');
      console.log('📑 Available sheets:', data.sheets?.map(s => s.properties.title) || 'None');
      
      // Try to get actual data
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
      const dataResponse = await fetch(sheetUrl);
      
      if (dataResponse.ok) {
        const sheetData = await dataResponse.json();
        console.log('📊 Data rows found:', sheetData.values?.length || 0);
        console.log('🎉 Your app should now load the real data from Google Sheets!');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Still not working:', response.status, errorText);
    }
  } catch (error) {
    console.error('🚨 Error:', error.message);
  }
}

quickTest();
