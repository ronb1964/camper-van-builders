/**
 * Update Google Sheets with better van conversion photos using service account
 */

const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Higher quality, more professional van conversion photos
const BETTER_PHOTOS = {
  'VanDoIt': [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  'Humble Road': [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format&q=80'
  ],
  'Ready.Set.Van': [
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80'
  ]
};

async function updatePhotosWithServiceAccount() {
  try {
    console.log('🔧 Setting up Google Sheets API with service account...');
    
    // Get service account credentials from environment
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not found in environment variables');
    }
    
    let credentials;
    try {
      credentials = JSON.parse(serviceAccountKey);
    } catch (parseError) {
      throw new Error(`Failed to parse service account credentials: ${parseError.message}`);
    }
    
    // Create JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    // Authenticate
    await auth.authorize();
    console.log('✅ Successfully authenticated with Google Sheets API');
    
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
        console.log(`🖼️ Preparing update for ${companyName}`);
        console.log(`   New URLs: ${photoUrls}`);
        
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
    const updateResponse = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`✅ Successfully updated ${updateResponse.data.totalUpdatedCells} cells!`);
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const verifyRows = verifyResponse.data.values;
    Object.keys(BETTER_PHOTOS).forEach(companyName => {
      const builderRow = verifyRows.find(row => row[1] === companyName);
      
      if (builderRow && builderRow[11]) {
        console.log(`✅ ${companyName}: Photos updated successfully`);
        console.log(`   Current: ${builderRow[11].substring(0, 80)}...`);
      } else {
        console.log(`❌ ${companyName}: Update verification failed`);
      }
    });
    
    console.log('\n🎉 Photo update complete! Refresh your React app to see the new images.');
    
  } catch (error) {
    console.error('❌ Error updating photos:', error.message);
    
    if (error.message.includes('GOOGLE_SERVICE_ACCOUNT_KEY')) {
      console.log('\n💡 The service account credentials are needed to update the Google Sheets.');
      console.log('   Since I cannot access the .env file, please run this command to check:');
      console.log('   echo $GOOGLE_SERVICE_ACCOUNT_KEY');
    }
  }
}

console.log('📸 Starting photo update process...\n');
updatePhotosWithServiceAccount();
