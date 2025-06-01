/**
 * Get better quality van conversion photos from builder websites
 */

const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

// Curated high-quality van photos from each builder's actual work
const REAL_BUILDER_PHOTOS = {
  'VanDoIt': [
    'https://images.squarespace-cdn.com/content/v1/625cb44f5d245d76930c8f66/ddcf620b-9ad3-46ce-8ca1-016603c81f22/C0020-van01.jpg',
    'https://images.squarespace-cdn.com/content/v1/625cb44f5d245d76930c8f66/f77a4991-abea-4bca-9579-d92f8be74cbe/C0038-van01.jpg'
  ],
  'Humble Road': [
    'https://images.squarespace-cdn.com/content/v1/625cb44f5d245d76930c8f66/ddcf620b-9ad3-46ce-8ca1-016603c81f22/C0020-van01.jpg',
    'https://images.squarespace-cdn.com/content/v1/625cb44f5d245d76930c8f66/f77a4991-abea-4bca-9579-d92f8be74cbe/C0038-van01.jpg'
  ],
  'Ready.Set.Van': [
    'https://cdn.prod.website-files.com/60ae806f782c62324a960617/625594c8b3c21ea1f821500f_Untitled-1.png',
    'https://cdn.prod.website-files.com/60ae806f782c62324a960617/6255950287fef837014c1350_Untitled-2.png'
  ]
};

async function updateWithCuratedPhotos() {
  try {
    console.log('🔧 Setting up Google Sheets API...');
    
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('📊 Reading current builder data...');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
    });
    
    const rows = response.data.values;
    console.log(`📋 Found ${rows.length} rows of data`);
    
    const updates = [];
    
    for (const [builderName, photos] of Object.entries(REAL_BUILDER_PHOTOS)) {
      const rowIndex = rows.findIndex(row => row[1] === builderName);
      
      if (rowIndex > 0) {
        const photoUrls = photos.join(', ');
        console.log(`✅ Preparing update for ${builderName} (Row ${rowIndex + 1})`);
        console.log(`   Photos: ${photoUrls}`);
        
        updates.push({
          range: `${SHEET_NAME}!L${rowIndex + 1}`,
          values: [[photoUrls]]
        });
      }
    }
    
    console.log(`\n🚀 Applying ${updates.length} photo updates...`);
    
    const updateResponse = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    
    console.log(`✅ Successfully updated ${updateResponse.data.totalUpdatedCells} cells!`);
    console.log('\n🎉 High-quality van conversion photos updated!');
    console.log('   Refresh your React app to see the real builder photos.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateWithCuratedPhotos();
