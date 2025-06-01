require('dotenv').config();
const { google } = require('googleapis');

// Get credentials from environment variables
const SERVICE_ACCOUNT_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = 'builders';

async function createSheetsClient() {
  const credentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function updateBuilderLocation(sheets, companyName, newLocation) {
  try {
    // First, find the row with the company name
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!B:C`, // Company Name and Location columns
    });

    const rows = response.data.values;
    if (!rows) return false;

    // Find the row index (skip header)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === companyName) {
        // Found the company, update location (column C, row i+1)
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!C${i + 1}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[newLocation]],
          },
        });
        console.log(`Updated cell C${i + 1} to: ${newLocation}`);
        return true;
      }
    }

    console.log(`Company "${companyName}" not found`);
    return false;
  } catch (error) {
    console.error('Error updating builder location:', error);
    throw error;
  }
}

async function getBuilders(sheets) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`, // State, Company Name, Location, Description
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    // Skip header row and convert to builder objects
    const builders = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[1]) continue; // Skip if no company name

      const builder = {
        id: i,
        name: row[1] || 'Unknown Builder',
        address: row[2] || 'Address not provided',
        state: row[0] || 'Unknown',
        description: row[3] || 'No description available'
      };

      builders.push(builder);
    }

    return builders;
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    throw error;
  }
}

async function fixHumbleRoadLocation() {
  try {
    if (!SERVICE_ACCOUNT_CREDENTIALS) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS not found in environment variables');
    }
    
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID not found in environment variables');
    }
    
    console.log('Initializing Google Sheets service...');
    const sheets = await createSheetsClient();
    
    console.log('Fetching current data to see what companies exist...');
    const builders = await getBuilders(sheets);
    console.log('Companies found:');
    builders.forEach((builder, index) => {
      console.log(`${index + 1}. "${builder.name}" - "${builder.address}" (State: ${builder.state})`);
    });
    
    // Look for Humble Road (or similar)
    const humbleRoadVariants = builders.filter(b => 
      b.name.toLowerCase().includes('humble') || 
      b.address.toLowerCase().includes('llc')
    );
    
    if (humbleRoadVariants.length > 0) {
      console.log('\nFound potential Humble Road entries:');
      humbleRoadVariants.forEach(builder => {
        console.log(`- "${builder.name}" with location: "${builder.address}"`);
      });
      
      // Try to update the first match
      const targetBuilder = humbleRoadVariants[0];
      console.log(`\nAttempting to update "${targetBuilder.name}" location to "Brick, NJ"...`);
      
      const success = await updateBuilderLocation(sheets, targetBuilder.name, 'Brick, NJ');
      
      if (success) {
        console.log('✅ Successfully updated location to "Brick, NJ"');
        
        // Verify the change
        console.log('Fetching updated data to verify...');
        const updatedBuilders = await getBuilders(sheets);
        const updatedBuilder = updatedBuilders.find(b => b.name === targetBuilder.name);
        
        if (updatedBuilder) {
          console.log(`✅ Verified: ${updatedBuilder.name} location is now: "${updatedBuilder.address}"`);
        }
      } else {
        console.log('❌ Could not update the location');
      }
    } else {
      console.log('\n❌ No entries found with "humble" in name or "llc" in address');
    }
    
  } catch (error) {
    console.error('Error fixing Humble Road location:', error);
  }
}

// Run the fix
fixHumbleRoadLocation();
