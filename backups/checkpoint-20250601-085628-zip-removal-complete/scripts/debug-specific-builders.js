const { google } = require('googleapis');
require('dotenv').config();

async function debugSpecificBuilders() {
  try {
    console.log('Environment variables check:');
    console.log('GOOGLE_SHEETS_CREDENTIALS exists:', !!process.env.GOOGLE_SHEETS_CREDENTIALS);
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);

    let auth;
    
    // Try different credential approaches
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        auth = new google.auth.JWT(
          credentials.client_email,
          null,
          credentials.private_key,
          ['https://www.googleapis.com/auth/spreadsheets']
        );
        console.log('Using GOOGLE_SHEETS_CREDENTIALS');
      } catch (parseError) {
        console.log('Failed to parse GOOGLE_SHEETS_CREDENTIALS:', parseError.message);
        throw parseError;
      }
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      console.log('Using separate email and private key');
    } else {
      throw new Error('No valid Google credentials found in environment variables');
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';

    console.log('\nFetching data from Google Sheets...');

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'builders!A:L', // Get all columns A through L
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in the sheet');
      return;
    }

    // Print headers
    console.log('Headers:', rows[0]);
    console.log('\n=== SEARCHING FOR SPECIFIC BUILDERS ===\n');

    // Look for VanDoIt, Humble Road, and Ready.Set.Van
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      
      const companyName = row[1] || ''; // Column B (Company Name)
      
      // Check if this row contains any of our target builders
      const isTargetBuilder = targetBuilders.some(target => 
        companyName.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(companyName.toLowerCase())
      );
      
      if (isTargetBuilder) {
        console.log(`\n--- ROW ${index + 1}: ${companyName} ---`);
        console.log('State:', row[0] || 'EMPTY');
        console.log('Company Name:', row[1] || 'EMPTY');
        console.log('Location:', row[2] || 'EMPTY');
        console.log('Description:', row[3] || 'EMPTY');
        console.log('Website:', row[4] || 'EMPTY');
        console.log('Phone:', row[5] || 'EMPTY');
        console.log('Email:', row[6] || 'EMPTY');
        console.log('Services:', row[7] || 'EMPTY');
        console.log('YouTube:', row[8] || 'EMPTY');
        console.log('Instagram:', row[9] || 'EMPTY');
        console.log('Facebook:', row[10] || 'EMPTY');
        console.log('Photos:', row[11] || 'EMPTY');
      }
    });

    // Also search for partial matches
    console.log('\n=== PARTIAL MATCHES ===\n');
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      
      const companyName = row[1] || '';
      
      if (companyName.toLowerCase().includes('van') || 
          companyName.toLowerCase().includes('humble') ||
          companyName.toLowerCase().includes('ready')) {
        console.log(`Row ${index + 1}: "${companyName}"`);
      }
    });

    console.log(`\nTotal rows in sheet: ${rows.length}`);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

debugSpecificBuilders();
