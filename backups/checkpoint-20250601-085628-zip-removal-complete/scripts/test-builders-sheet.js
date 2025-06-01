#!/usr/bin/env node

// Test the correct sheet name "builders"
const API_KEY = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
const SHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';

console.log('🔍 Testing with correct sheet name "builders"...');

async function testBuildersSheet() {
  try {
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/builders?key=${API_KEY}`;
    console.log('🌐 Requesting:', sheetUrl);
    
    const response = await fetch(sheetUrl);
    console.log('📊 Response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Sheet data retrieved');
      console.log('📊 Total rows:', data.values?.length || 0);
      console.log('📋 Headers:', data.values?.[0] || 'No headers');
      console.log('📋 First data row:', data.values?.[1] || 'No data');
      console.log('🎉 Your Google Sheets API is working perfectly!');
      
      if (data.values && data.values.length > 1) {
        console.log('\n📊 All data preview:');
        data.values.slice(0, 5).forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error:', errorText);
    }
  } catch (error) {
    console.error('🚨 Error:', error.message);
  }
}

testBuildersSheet();
