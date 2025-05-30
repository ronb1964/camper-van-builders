// Test script to examine the data format from Google Sheets
const sheetId = '1gfw9r6opnyf6CFaQQJA_s0bBjHsphnImwaOuEdWpLYU';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

console.log('Examining data format from Google Sheets');
console.log('Sheet ID:', sheetId);
console.log('API Key available:', apiKey ? `Yes (${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)})` : 'No');

// Make a direct request to the Google Sheets API
async function examineSheetData() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/van?key=${apiKey}`;
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
      // Show the first 5 rows to examine the data format
      console.log('\nExamining the first 5 rows:');
      for (let i = 0; i < Math.min(5, data.values.length); i++) {
        console.log(`Row ${i}:`, data.values[i]);
      }
      
      // Check if the data format matches what our code expects
      console.log('\nAnalyzing data format:');
      const firstRow = data.values[0];
      if (firstRow.length === 0) {
        console.log('WARNING: First row is empty. Expected headers.');
      } else {
        console.log('First row appears to be:', firstRow.join(', '));
        console.log('Is this a header row?', firstRow.some(cell => 
          typeof cell === 'string' && 
          ['name', 'address', 'state', 'city', 'phone', 'email'].includes(cell.toLowerCase())
        ) ? 'Likely yes' : 'Likely no');
      }
    }
  } catch (error) {
    console.error('Error examining sheet data:', error);
  }
}

examineSheetData();
