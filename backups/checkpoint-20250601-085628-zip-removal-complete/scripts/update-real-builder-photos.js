/**
 * Script to update Google Sheets with more appropriate van conversion photos
 * These are better placeholder photos that represent actual van conversion work
 */

const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// More appropriate van conversion photos (these look like actual builds)
const BETTER_PHOTOS = {
  'VanDoIt': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop', // Professional van interior
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'  // Van conversion kitchen
  ],
  'Humble Road': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', // Van conversion interior
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'  // Van conversion bedroom
  ],
  'Ready.Set.Van': [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', // Van conversion living area
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop'  // Van conversion full view
  ]
};

async function updateBuilderPhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    // Parse the service account credentials
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
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
      
      if (BETTER_PHOTOS[companyName]) {
        const photoUrls = BETTER_PHOTOS[companyName].join(', ');
        console.log(`🖼️ Updating photos for ${companyName}: ${photoUrls}`);
        
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
    
    console.log('✅ Successfully updated builder photos!');
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    for (const companyName of Object.keys(BETTER_PHOTOS)) {
      const verifyResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:L`,
      });
      
      const verifyRows = verifyResponse.data.values;
      const builderRow = verifyRows.find(row => row[1] === companyName);
      
      if (builderRow && builderRow[11]) {
        console.log(`✅ ${companyName}: ${builderRow[11]}`);
      } else {
        console.log(`❌ ${companyName}: No photos found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating photos:', error.message);
  }
}

// Instructions for adding real photos
console.log(`
📸 PHOTO UPDATE INSTRUCTIONS:

This script updates the photos with better van conversion images, but for REAL builder photos:

1. VanDoIt (https://vandoit.com/about-us/photos/):
   - Visit their photo gallery page
   - Right-click on actual build photos
   - Copy image URLs and replace in Google Sheets

2. Humble Road (https://www.humbleroad.tv/van01):
   - Visit their individual van project pages
   - Right-click on van interior/exterior photos
   - Copy image URLs and replace in Google Sheets

3. Ready.Set.Van (https://www.readysetvan.com/gramercy):
   - Visit their build showcase pages
   - Right-click on van conversion photos
   - Copy image URLs and replace in Google Sheets

To get real photos:
1. Visit the builder's website
2. Find their gallery/projects section
3. Right-click on photos → "Copy image address"
4. Update Google Sheets Column L with real URLs

Running this script now with better placeholder photos...
`);

updateBuilderPhotos();
