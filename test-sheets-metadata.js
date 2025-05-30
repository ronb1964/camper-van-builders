// Test script to check Google Sheets metadata
const sheetId = '1gfw9r6opnyf6CFaQQJA_s0bBjHsphnImwaOuEdWpLYU';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('Testing Google Sheets metadata access');
console.log('Sheet ID:', sheetId);
console.log('API Key available:', apiKey ? `Yes (${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)})` : 'No');

// Make a direct request to the Google Sheets API to get metadata
async function testSheetsMetadata() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('Spreadsheet title:', data.properties?.title);
    console.log('Sheets available:');
    
    if (data.sheets) {
      data.sheets.forEach(sheet => {
        console.log(`- ${sheet.properties?.title} (ID: ${sheet.properties?.sheetId})`);
      });
    }
  } catch (error) {
    console.error('Error testing Sheets metadata:', error);
  }
}

testSheetsMetadata();
