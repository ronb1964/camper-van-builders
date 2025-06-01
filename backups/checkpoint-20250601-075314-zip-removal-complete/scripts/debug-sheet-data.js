require('dotenv').config();
const { google } = require('googleapis');

async function debugSheetData() {
  try {
    console.log('🔍 Debugging Google Sheet data...');
    
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'builders!A:L',
    });

    const rows = response.data.values;
    
    console.log('📊 Sheet Headers:');
    console.log(rows[0]);
    
    console.log('\n📋 First few rows of data:');
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      console.log(`Row ${i + 1}:`, rows[i]);
    }
    
    console.log('\n🔍 Checking specific builders:');
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] && (row[1].includes('VanDoIt') || row[1].includes('Humble') || row[1].includes('Ready'))) {
        console.log(`\n${row[1]}:`);
        console.log('  Website:', row[4] || 'MISSING');
        console.log('  Phone:', row[5] || 'MISSING');
        console.log('  Email:', row[6] || 'MISSING');
        console.log('  Services:', row[7] || 'MISSING');
        console.log('  YouTube:', row[8] || 'MISSING');
        console.log('  Instagram:', row[9] || 'MISSING');
        console.log('  Facebook:', row[10] || 'MISSING');
        console.log('  Photos:', row[11] || 'MISSING');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSheetData();
