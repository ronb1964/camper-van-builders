require('dotenv').config();
const { GoogleSheetsService } = require('./src/services/googleSheetsService.ts');

// Get credentials from environment variables
const SERVICE_ACCOUNT_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function fixHumbleRoadLocation() {
  try {
    if (!SERVICE_ACCOUNT_CREDENTIALS) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS not found in environment variables');
    }
    
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID not found in environment variables');
    }
    
    console.log('Initializing Google Sheets service...');
    const sheetsService = new GoogleSheetsService(SERVICE_ACCOUNT_CREDENTIALS, SPREADSHEET_ID);
    
    console.log('Attempting to update Humble Road location...');
    const success = await sheetsService.updateBuilderLocation('Humble Road', 'Brick, NJ');
    
    if (success) {
      console.log('✅ Successfully updated Humble Road location to "Brick, NJ"');
    } else {
      console.log('❌ Could not find "Humble Road" in the sheet');
      
      // Let's see what companies are in the sheet
      console.log('Fetching all builders to see available companies...');
      const builders = await sheetsService.getBuilders();
      console.log('Companies found:');
      builders.forEach((builder, index) => {
        console.log(`${index + 1}. ${builder.name} - ${builder.address}`);
      });
    }
    
    // Verify the change
    console.log('Fetching updated data to verify...');
    const builders = await sheetsService.getBuilders();
    const humbleRoad = builders.find(b => b.name.includes('Humble'));
    
    if (humbleRoad) {
      console.log(`Found: ${humbleRoad.name} location is now: "${humbleRoad.address}"`);
    } else {
      console.log('No company with "Humble" in the name found');
    }
    
  } catch (error) {
    console.error('Error fixing Humble Road location:', error);
  }
}

// Run the fix
fixHumbleRoadLocation();
