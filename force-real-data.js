// Force real data test script
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const sheetId = '1gfw9r6opnyf6CFaQQJA_s0bBjHsphnImwaOuEdWpLYU';

console.log('API Key:', apiKey ? 'Available' : 'Missing');
console.log('Sheet ID:', sheetId);

// Direct test to fetch data from Google Sheets
async function fetchDirectFromSheet() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/van?key=${apiKey}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response:', data);
      return;
    }
    
    // Process the data directly
    const rows = data.values || [];
    if (rows.length < 4) {
      console.error('Not enough rows in the sheet');
      return;
    }
    
    // Row 2 contains the actual headers
    const headers = rows[2];
    console.log('Headers:', headers);
    
    // Create a direct result object
    const builders = [];
    
    // Process each row (start from row 3, which is the first data row)
    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      if (!row.length) continue; // Skip empty rows
      
      // Extract data from the row
      const builder = {
        id: `nj-${i-2}`,
        name: row[0] || 'Unknown Builder',
        address: row[1] || 'New Jersey',
        description: row[2] || '',
        location: {
          state: 'New Jersey'
        }
      };
      
      // Extract city/state from location field
      if (row[1]) {
        const locationParts = row[1].split(',');
        if (locationParts.length >= 2) {
          builder.location.city = locationParts[0].trim();
        }
      }
      
      builders.push(builder);
    }
    
    console.log('Builders found:', builders.length);
    if (builders.length > 0) {
      console.log('First builder:', builders[0]);
    }
    
    // Create a result object like what the app expects
    const result = {
      'New Jersey': builders
    };
    
    console.log('Final result structure:', Object.keys(result));
    console.log('New Jersey builders count:', result['New Jersey'].length);
    
    return result;
  } catch (error) {
    console.error('Error in direct test:', error);
  }
}

fetchDirectFromSheet();
