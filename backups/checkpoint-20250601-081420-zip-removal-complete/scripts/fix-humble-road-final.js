const { google } = require('googleapis');
require('dotenv').config();

// Get credentials from environment variables
const SERVICE_ACCOUNT_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
const SHEET_NAME = 'builders';

async function createSheetsClient() {
  const credentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function fixHumbleRoadDescription() {
  try {
    console.log('🔧 Fixing Humble Road description...');
    
    const sheets = await createSheetsClient();
    
    // First, find the Humble Road row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`, // All columns
    });

    const rows = response.data.values;
    if (!rows) {
      console.log('❌ No data found');
      return;
    }

    // Find Humble Road row
    let targetRowIndex = -1;
    for (let i = 1; i < rows.length; i++) { // Skip header
      if (rows[i][1] === 'Humble Road') {
        targetRowIndex = i + 1; // +1 because sheets are 1-indexed
        console.log(`✅ Found Humble Road at row ${targetRowIndex}`);
        console.log('Current description:', rows[i][3]);
        break;
      }
    }

    if (targetRowIndex === -1) {
      console.log('❌ Humble Road not found');
      return;
    }

    // Update the description (column D)
    const newDescription = 'Specializes in custom camper van conversions with a focus on minimalist design and off-grid capabilities. Known for their YouTube channel documenting van life adventures and builds.';
    
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!D${targetRowIndex}`, // Column D at the target row
      valueInputOption: 'RAW',
      resource: {
        values: [[newDescription]]
      }
    });

    console.log('✅ Description updated successfully!');
    console.log('New description:', newDescription);
    
    // Verify the update
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!D${targetRowIndex}`,
    });
    
    console.log('✅ Verified - Current description:', verifyResponse.data.values[0][0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

fixHumbleRoadDescription();
