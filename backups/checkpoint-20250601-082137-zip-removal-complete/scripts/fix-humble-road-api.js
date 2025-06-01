// Fix Humble Road description using the API key approach
async function fixHumbleRoadDescription() {
  try {
    console.log('🔧 Checking Humble Road description...');
    
    const apiKey = 'AIzaSyCmIKkLtGO5dftk_M_9rUGoJQl8zy-CFFI';
    const spreadsheetId = '1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/builders!A:L?key=${apiKey}`;
    
    // First, let's get the current data to see exactly what's wrong
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;
    
    console.log('📊 Checking current data...');
    
    // Find Humble Road
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === 'Humble Road') {
        console.log(`✅ Found Humble Road at row ${i + 1}`);
        console.log('Current data:');
        console.log('  State:', row[0]);
        console.log('  Company:', row[1]);
        console.log('  Location:', row[2]);
        console.log('  Description:', row[3]);
        console.log('  Website:', row[4]);
        console.log('  Phone:', row[5]);
        console.log('  Email:', row[6]);
        console.log('  Services:', row[7]);
        console.log('  YouTube:', row[8]);
        console.log('  Instagram:', row[9]);
        console.log('  Facebook:', row[10]);
        console.log('  Photos:', row[11]);
        
        if (row[3] === 'New Jersey') {
          console.log('❌ Description is indeed just "New Jersey" - this needs to be fixed');
          console.log('📝 The description should be updated to something like:');
          console.log('   "Specializes in custom camper van conversions with a focus on minimalist design and off-grid capabilities. Known for their YouTube channel documenting van life adventures and builds."');
        } else {
          console.log('✅ Description looks good:', row[3]);
        }
        
        return;
      }
    }
    
    console.log('❌ Humble Road not found');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixHumbleRoadDescription();
