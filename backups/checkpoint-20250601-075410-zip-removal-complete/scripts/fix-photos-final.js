/**
 * Final script to update Google Sheets with better van conversion photos
 * Using the same approach that worked for previous updates
 */

const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Better quality van conversion photos - higher resolution and professional
const UPDATED_PHOTOS = {
  'VanDoIt': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format&q=80, https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80',
  'Humble Road': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&auto=format&q=80, https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format&q=80',
  'Ready.Set.Van': 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop&auto=format&q=80, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80'
};

async function updatePhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    // Parse the service account credentials from .env
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    // Create JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Reading current data...');
    
    // Read current data to find row numbers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const rows = response.data.values;
    console.log(`📋 Found ${rows.length} rows`);
    
    // Update each builder's photos
    for (const [companyName, photoUrls] of Object.entries(UPDATED_PHOTOS)) {
      // Find the row for this company
      const rowIndex = rows.findIndex(row => row[1] === companyName);
      
      if (rowIndex > 0) { // Skip header row
        const cellRange = `${SHEET_NAME}!L${rowIndex + 1}`;
        
        console.log(`🖼️ Updating ${companyName} photos in ${cellRange}...`);
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: cellRange,
          valueInputOption: 'RAW',
          resource: {
            values: [[photoUrls]]
          }
        });
        
        console.log(`✅ Updated ${companyName} successfully`);
      } else {
        console.log(`❌ Could not find ${companyName} in sheet`);
      }
    }
    
    console.log('\n🎉 All photo updates completed!');
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const verifyRows = verifyResponse.data.values;
    Object.keys(UPDATED_PHOTOS).forEach(companyName => {
      const builderRow = verifyRows.find(row => row[1] === companyName);
      if (builderRow && builderRow[11]) {
        console.log(`✅ ${companyName}: ${builderRow[11].substring(0, 60)}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Fallback: show manual update instructions
    console.log('\n📝 Manual Update Instructions:');
    console.log('Open: https://docs.google.com/spreadsheets/d/1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M');
    console.log('Update Column L (Photos) with these URLs:\n');
    
    Object.entries(UPDATED_PHOTOS).forEach(([company, urls]) => {
      console.log(`${company}:`);
      console.log(`${urls}\n`);
    });
  }
}

updatePhotos();
