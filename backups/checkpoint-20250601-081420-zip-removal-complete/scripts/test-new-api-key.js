#!/usr/bin/env node

// Test script for your new API key from the Camper-van-builders project
require('dotenv').config();

const SHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';

console.log('🔍 Testing new API key from Camper-van-builders project...');

// You can also pass the API key as a command line argument for testing
const API_KEY = process.argv[2] || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.log('❌ No API key provided');
  console.log('💡 Usage: node test-new-api-key.js YOUR_NEW_API_KEY');
  console.log('💡 Or update your .env file and run: node test-new-api-key.js');
  process.exit(1);
}

console.log('🔑 Testing API Key:', `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 6)}`);

async function testNewAPIKey() {
  try {
    // Test 1: Get spreadsheet metadata
    console.log('\n📋 Test 1: Getting spreadsheet metadata...');
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
    
    const metadataResponse = await fetch(metadataUrl);
    console.log('📊 Metadata Response:', metadataResponse.status, metadataResponse.statusText);
    
    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('❌ Metadata Error:', errorText);
      
      if (errorText.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
        console.log('💡 This error is expected when testing from Node.js');
        console.log('💡 The API key should work fine in your React app at localhost:3000');
        return;
      }
      return;
    }
    
    const metadata = await metadataResponse.json();
    console.log('✅ Metadata retrieved successfully!');
    console.log('📑 Available sheets:', metadata.sheets?.map(s => s.properties.title) || 'None found');
    
    // Test 2: Try to read data
    console.log('\n📊 Test 2: Reading sheet data...');
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    
    const sheetResponse = await fetch(sheetUrl);
    console.log('📊 Sheet Response:', sheetResponse.status, sheetResponse.statusText);
    
    if (sheetResponse.ok) {
      const sheetData = await sheetResponse.json();
      console.log('✅ Sheet data retrieved successfully!');
      console.log('📊 Rows found:', sheetData.values?.length || 0);
      console.log('🎉 Your new API key is working perfectly!');
      
      if (sheetData.values && sheetData.values.length > 0) {
        console.log('\n📋 First few rows:');
        console.log(JSON.stringify(sheetData.values.slice(0, 3), null, 2));
      }
    } else {
      const errorText = await sheetResponse.text();
      console.error('❌ Sheet Error:', errorText);
    }
    
  } catch (error) {
    console.error('🚨 Unexpected error:', error.message);
  }
}

testNewAPIKey();
