#!/usr/bin/env node

// Debug script to test Google Sheets API connection
require('dotenv').config();

const SHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('🔍 Debug: Testing Google Sheets API Connection');
console.log('📄 Sheet ID:', SHEET_ID);
console.log('🔑 API Key status:', API_KEY ? `Available (${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)})` : 'Missing');

if (!API_KEY) {
  console.error('❌ No API key found in environment variables');
  process.exit(1);
}

async function testSheetsAPI() {
  try {
    // Test 1: Get spreadsheet metadata
    console.log('\n📋 Test 1: Getting spreadsheet metadata...');
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
    console.log('🌐 Metadata URL:', metadataUrl);
    
    const metadataResponse = await fetch(metadataUrl);
    console.log('📊 Metadata Response status:', metadataResponse.status, metadataResponse.statusText);
    
    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('❌ Metadata Error:', errorText);
      return;
    }
    
    const metadata = await metadataResponse.json();
    console.log('✅ Metadata retrieved successfully');
    console.log('📑 Available sheets:', metadata.sheets?.map(s => s.properties.title) || 'None found');
    
    // Test 2: Try to read from different sheet names
    const possibleSheetNames = ['builders', 'Sheet1', 'USA_van_builders', 'van_builders', 'data'];
    
    for (const sheetName of possibleSheetNames) {
      console.log(`\n📊 Test 2.${possibleSheetNames.indexOf(sheetName) + 1}: Trying sheet "${sheetName}"...`);
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
      console.log('🌐 Sheet URL:', sheetUrl);
      
      const sheetResponse = await fetch(sheetUrl);
      console.log('📊 Sheet Response status:', sheetResponse.status, sheetResponse.statusText);
      
      if (sheetResponse.ok) {
        const sheetData = await sheetResponse.json();
        console.log('✅ Sheet data retrieved successfully');
        console.log('📊 Rows found:', sheetData.values?.length || 0);
        console.log('📊 First few rows:', JSON.stringify(sheetData.values?.slice(0, 3), null, 2));
        break; // Found working sheet
      } else {
        const errorText = await sheetResponse.text();
        console.log('❌ Sheet Error:', errorText);
      }
    }
    
  } catch (error) {
    console.error('🚨 Unexpected error:', error);
  }
}

// Run the test
testSheetsAPI();
