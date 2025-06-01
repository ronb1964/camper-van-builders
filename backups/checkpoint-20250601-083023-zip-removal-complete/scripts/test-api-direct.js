require('dotenv').config();

async function testGoogleSheetsAPI() {
  try {
    const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const SHEET_NAME = 'builders';
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    console.log('🔍 Testing Google Sheets API...');
    console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:L?key=${API_KEY}`;
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    const rows = data.values;
    
    console.log('📊 Headers:', rows[0]);
    console.log(`📋 Found ${rows.length - 1} builders`);
    
    // Check first few builders for enhanced data
    for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
      const row = rows[i];
      console.log(`\n🏢 Builder ${i}: ${row[1]}`);
      console.log('  Website:', row[4] || 'MISSING');
      console.log('  Phone:', row[5] || 'MISSING');
      console.log('  Email:', row[6] || 'MISSING');
      console.log('  Services:', row[7] || 'MISSING');
      console.log('  YouTube:', row[8] || 'MISSING');
      console.log('  Instagram:', row[9] || 'MISSING');
      console.log('  Facebook:', row[10] || 'MISSING');
      console.log('  Photos:', row[11] || 'MISSING');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testGoogleSheetsAPI();
