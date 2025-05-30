// Test script to check Google Sheets API access with Sheet1
const sheetId = '1gfw9r6opnyf6CFaQQJA_s0bBjHsphnImwaOuEdWpLYU';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('Testing Google Sheets API access with Sheet1');
console.log('Sheet ID:', sheetId);
console.log('API Key available:', apiKey ? `Yes (${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)})` : 'No');

// Make a direct request to the Google Sheets API
async function testSheetsApi() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('Data received:', data ? 'Yes' : 'No');
    console.log('Rows found:', data.values ? data.values.length : 0);
    
    if (data.values && data.values.length > 0) {
      console.log('Headers:', data.values[0]);
      if (data.values.length > 1) {
        console.log('First data row:', data.values[1]);
      }
    }
  } catch (error) {
    console.error('Error testing Sheets API:', error);
  }
}

testSheetsApi();
