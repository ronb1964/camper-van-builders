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
        rowIndex: i + 1, // 1-based index for Google Sheets
        state: row[0] || 'Unknown',
        name: row[1] || 'Unknown Builder',
        location: row[2] || 'Address not provided',
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

async function searchForBuilderInfo(builderName, location) {
  // This is a placeholder for web search functionality
  // We'll use the search_web tool through the main script
  console.log(`Searching for: ${builderName} in ${location}`);
  
  // For now, return some example enriched data
  // In practice, this would parse search results
  return {
    website: null,
    phone: null,
    email: null,
    enhancedDescription: null,
    services: null
  };
}

async function addColumnsToSheet(sheets, newHeaders) {
  try {
    // First, get current headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!1:1`,
    });

    const currentHeaders = response.data.values[0] || [];
    console.log('Current headers:', currentHeaders);

    // Add new headers if they don't exist
    const headersToAdd = [];
    newHeaders.forEach(header => {
      if (!currentHeaders.includes(header)) {
        headersToAdd.push(header);
      }
    });

    if (headersToAdd.length > 0) {
      const startColumn = String.fromCharCode(65 + currentHeaders.length); // Convert to letter (E, F, G, etc.)
      const endColumn = String.fromCharCode(65 + currentHeaders.length + headersToAdd.length - 1);
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${startColumn}1:${endColumn}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headersToAdd],
        },
      });
      
      console.log(`Added new headers: ${headersToAdd.join(', ')}`);
      return currentHeaders.concat(headersToAdd);
    }

    return currentHeaders;
  } catch (error) {
    console.error('Error adding columns:', error);
    throw error;
  }
}

async function updateBuilderData(sheets, rowIndex, columnIndex, value) {
  try {
    const column = String.fromCharCode(65 + columnIndex); // Convert to letter
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${column}${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[value]],
      },
    });
    console.log(`Updated ${column}${rowIndex} with: ${value}`);
  } catch (error) {
    console.error('Error updating cell:', error);
    throw error;
  }
}

async function enrichBuilderData() {
  try {
    console.log('🚀 Starting builder data enrichment...');
    
    const sheets = await createSheetsClient();
    
    // Add new columns for additional data
    const newHeaders = ['Website', 'Phone', 'Email', 'Services'];
    const allHeaders = await addColumnsToSheet(sheets, newHeaders);
    console.log('All headers:', allHeaders);
    
    // Get current builders
    const builders = await getBuilders(sheets);
    console.log(`Found ${builders.length} builders to enrich`);
    
    // Process each builder
    for (let i = 0; i < Math.min(builders.length, 5); i++) { // Limit to first 5 for testing
      const builder = builders[i];
      console.log(`\n📋 Processing: ${builder.name}`);
      
      // Search for additional info (placeholder for now)
      const enrichedData = await searchForBuilderInfo(builder.name, builder.location);
      
      // Update the sheet with any found data
      if (enrichedData.website) {
        const websiteColumnIndex = allHeaders.indexOf('Website');
        await updateBuilderData(sheets, builder.rowIndex, websiteColumnIndex, enrichedData.website);
      }
      
      if (enrichedData.phone) {
        const phoneColumnIndex = allHeaders.indexOf('Phone');
        await updateBuilderData(sheets, builder.rowIndex, phoneColumnIndex, enrichedData.phone);
      }
      
      if (enrichedData.email) {
        const emailColumnIndex = allHeaders.indexOf('Email');
        await updateBuilderData(sheets, builder.rowIndex, emailColumnIndex, enrichedData.email);
      }
      
      if (enrichedData.services) {
        const servicesColumnIndex = allHeaders.indexOf('Services');
        await updateBuilderData(sheets, builder.rowIndex, servicesColumnIndex, enrichedData.services);
      }
      
      // Add a small delay to be respectful to search APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Data enrichment completed!');
    
  } catch (error) {
    console.error('Error enriching builder data:', error);
  }
}

// Export functions for use in other scripts
module.exports = {
  createSheetsClient,
  getBuilders,
  addColumnsToSheet,
  updateBuilderData,
  enrichBuilderData
};

// Run if called directly
if (require.main === module) {
  enrichBuilderData();
}
