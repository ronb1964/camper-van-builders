require('dotenv').config();

async function debugBuildersWithApiKey() {
  try {
    // Use the API key approach that we know works
    const apiKey = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
    const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const sheetName = 'builders';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:L?key=${apiKey}`;
    
    console.log('Fetching data from Google Sheets using API key...');
    console.log('URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.log('No data found in the sheet');
      return;
    }

    const rows = data.values;
    console.log('Headers:', rows[0]);
    console.log(`Total rows: ${rows.length}`);
    console.log('\n=== SEARCHING FOR SPECIFIC BUILDERS ===\n');

    // Look for VanDoIt, Humble Road, and Ready.Set.Van
    const targetBuilders = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    let foundBuilders = [];
    
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      
      const companyName = row[1] || ''; // Column B (Company Name)
      
      // Check if this row contains any of our target builders
      const isTargetBuilder = targetBuilders.some(target => 
        companyName.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(companyName.toLowerCase())
      );
      
      if (isTargetBuilder) {
        foundBuilders.push(companyName);
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

    console.log('\n=== SUMMARY ===');
    console.log('Target builders we were looking for:', targetBuilders);
    console.log('Builders found in sheet:', foundBuilders);
    
    if (foundBuilders.length === 0) {
      console.log('\n⚠️  NONE of the target builders were found!');
      console.log('\n=== ALL COMPANY NAMES IN SHEET ===');
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const companyName = row[1] || '';
        if (companyName) {
          console.log(`Row ${index + 1}: "${companyName}"`);
        }
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugBuildersWithApiKey();
