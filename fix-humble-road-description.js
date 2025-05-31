const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

async function fixHumbleRoadDescription() {
  try {
    console.log('🔧 Fixing Humble Road description...');
    
    // Initialize the sheet
    const doc = new GoogleSpreadsheet('1noZol3jQUF9EXHnatCHttRwmOgGN7S4Cavvrv9XyR8M');
    
    // Authenticate with service account
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    await doc.useServiceAccountAuth(credentials);
    
    // Load document properties and worksheets
    await doc.loadInfo();
    console.log('📊 Connected to:', doc.title);
    
    // Get the builders sheet
    const sheet = doc.sheetsByTitle['builders'];
    if (!sheet) {
      throw new Error('Sheet "builders" not found');
    }
    
    // Load all rows
    await sheet.loadCells('A1:L100'); // Load enough cells
    
    // Find Humble Road (should be row 12 based on our debug output)
    console.log('🔍 Looking for Humble Road...');
    
    for (let i = 1; i < 100; i++) { // Start from row 2 (index 1)
      const companyCell = sheet.getCell(i, 1); // Column B (Company Name)
      if (companyCell.value === 'Humble Road') {
        console.log(`✅ Found Humble Road at row ${i + 1}`);
        
        const descriptionCell = sheet.getCell(i, 3); // Column D (Description)
        console.log('Current description:', descriptionCell.value);
        
        // Update with a proper description
        const newDescription = 'Specializes in custom camper van conversions with a focus on minimalist design and off-grid capabilities. Known for their YouTube channel documenting van life adventures and builds.';
        descriptionCell.value = newDescription;
        
        console.log('🔄 Updating description...');
        await sheet.saveUpdatedCells();
        
        console.log('✅ Description updated successfully!');
        console.log('New description:', newDescription);
        
        return;
      }
    }
    
    console.log('❌ Humble Road not found in the sheet');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixHumbleRoadDescription();
