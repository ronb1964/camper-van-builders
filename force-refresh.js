// Simple script to test if the app is working
console.log('Testing if the enhanced data is working...');

// Check if we can access the Google Sheets API
const testAPI = async () => {
  const SPREADSHEET_ID = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
  const SHEET_NAME = 'builders';
  const API_KEY = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:L?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('✅ API working, found', data.values.length - 1, 'builders');
    
    // Check VanDoIt data
    const vandoit = data.values[1];
    console.log('VanDoIt data:', {
      name: vandoit[1],
      website: vandoit[4],
      phone: vandoit[5],
      email: vandoit[6],
      youtube: vandoit[8],
      instagram: vandoit[9],
      facebook: vandoit[10],
      photos: vandoit[11]
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
  }
};

testAPI();
