/**
 * Update Google Sheets with professional van conversion photos
 * These are high-quality images that represent the type of work these builders do
 */

const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Professional van conversion photos that represent quality builds
const PROFESSIONAL_PHOTOS = {
  'VanDoIt': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format', // Modern van interior
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format'  // Professional kitchen setup
  ],
  'Humble Road': [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&auto=format', // Luxury van conversion
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format'  // Van conversion bedroom
  ],
  'Ready.Set.Van': [
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop&auto=format', // Professional van build
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format'  // Van conversion living area
  ]
};

async function updateProfessionalPhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    // Parse the service account credentials from environment
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      console.log('❌ Error parsing credentials. Trying alternative approach...');
      
      // Alternative: use the API key approach
      const sheets = google.sheets({ 
        version: 'v4', 
        auth: process.env.REACT_APP_GOOGLE_MAPS_API_KEY 
      });
      
      console.log('📊 Reading current data with API key...');
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:L`,
      });
      
      console.log('❌ Cannot update with read-only API key. Need service account credentials.');
      console.log('📋 Current photo data:');
      
      const rows = response.data.values;
      for (let i = 1; i < rows.length; i++) {
        const companyName = rows[i][1];
        if (PROFESSIONAL_PHOTOS[companyName]) {
          console.log(`${companyName}: ${rows[i][11] || 'No photos'}`);
        }
      }
      
      console.log('\n🔧 Manual Update Instructions:');
      console.log('Since we need write access, please manually update these URLs in Google Sheets:');
      console.log('https://docs.google.com/spreadsheets/d/1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M');
      console.log('\nColumn L (Photos) - Replace with these professional URLs:');
      
      Object.entries(PROFESSIONAL_PHOTOS).forEach(([company, urls]) => {
        console.log(`\n${company}:`);
        console.log(urls.join(', '));
      });
      
      return;
    }
    
    // Create JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Reading current builder data...');
    
    // Read current data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('❌ No data found in sheet');
      return;
    }
    
    console.log(`📋 Found ${rows.length} rows of data`);
    
    // Find and update target builders
    const updates = [];
    
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
      const row = rows[i];
      const companyName = row[1]; // Column B
      
      if (PROFESSIONAL_PHOTOS[companyName]) {
        const photoUrls = PROFESSIONAL_PHOTOS[companyName].join(', ');
        console.log(`🖼️ Updating photos for ${companyName}`);
        console.log(`   URLs: ${photoUrls}`);
        
        updates.push({
          range: `${SHEET_NAME}!L${i + 1}`, // Column L (photos)
          values: [[photoUrls]]
        });
      }
    }
    
    if (updates.length === 0) {
      console.log('❌ No target builders found to update');
      return;
    }
    
    console.log(`🚀 Applying ${updates.length} photo updates...`);
    
    // Apply all updates
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log('✅ Successfully updated builder photos with professional images!');
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const verifyRows = verifyResponse.data.values;
    Object.keys(PROFESSIONAL_PHOTOS).forEach(companyName => {
      const builderRow = verifyRows.find(row => row[1] === companyName);
      
      if (builderRow && builderRow[11]) {
        console.log(`✅ ${companyName}: Updated successfully`);
      } else {
        console.log(`❌ ${companyName}: Update failed`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating photos:', error.message);
    
    // Provide manual instructions as fallback
    console.log('\n🔧 Manual Update Instructions:');
    console.log('Please manually update these URLs in Google Sheets:');
    console.log('https://docs.google.com/spreadsheets/d/1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M');
    console.log('\nColumn L (Photos) - Replace with these professional URLs:');
    
    Object.entries(PROFESSIONAL_PHOTOS).forEach(([company, urls]) => {
      console.log(`\n${company}:`);
      console.log(urls.join(', '));
    });
  }
}

console.log('📸 Updating builder photos with professional van conversion images...\n');
updateProfessionalPhotos();
