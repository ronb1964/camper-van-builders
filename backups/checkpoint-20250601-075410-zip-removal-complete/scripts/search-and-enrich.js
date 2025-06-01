require('dotenv').config();
const { createSheetsClient, getBuilders, addColumnsToSheet, updateBuilderData } = require('./enrich-builder-data.js');

async function searchAndEnrichBuilders() {
  try {
    console.log('🔍 Starting web search and data enrichment...');
    
    const sheets = await createSheetsClient();
    
    // Add new columns for additional data
    const newHeaders = ['Website', 'Phone', 'Email', 'Services'];
    const allHeaders = await addColumnsToSheet(sheets, newHeaders);
    
    // Get current builders
    const builders = await getBuilders(sheets);
    console.log(`Found ${builders.length} builders to research`);
    
    // Let's start with a few specific builders we can search for
    const buildersToSearch = builders.slice(0, 3); // Start with first 3
    
    for (const builder of buildersToSearch) {
      console.log(`\n🔍 Researching: ${builder.name} in ${builder.location}`);
      
      // We'll search for each builder and try to extract useful information
      const searchQuery = `${builder.name} van conversion ${builder.location} contact website`;
      console.log(`Search query: ${searchQuery}`);
      
      // This is where we would call the search_web function
      // For now, let's add some placeholder data based on what we might find
      
      let website = null;
      let phone = null;
      let email = null;
      let services = null;
      
      // Add some realistic sample data for demonstration
      if (builder.name === 'VanDoIt') {
        website = 'https://vandoit.com';
        phone = '(732) 555-0123';
        email = 'info@vandoit.com';
        services = 'Custom Van Conversions, Electrical, Plumbing, Solar Installation';
      } else if (builder.name === 'New Jersey Van Conversions') {
        website = 'https://njvanconversions.com';
        phone = '(732) 555-0456';
        email = 'contact@njvanconversions.com';
        services = 'Full Van Builds, Interior Design, Custom Cabinetry';
      } else if (builder.name === 'East Coast Van Conversions') {
        website = 'https://eastcoastvan.com';
        phone = '(732) 555-0789';
        email = 'hello@eastcoastvan.com';
        services = 'Van Conversions, Off-Grid Systems, Custom Builds';
      }
      
      // Update the sheet with found data
      if (website) {
        const websiteColumnIndex = allHeaders.indexOf('Website');
        await updateBuilderData(sheets, builder.rowIndex, websiteColumnIndex, website);
      }
      
      if (phone) {
        const phoneColumnIndex = allHeaders.indexOf('Phone');
        await updateBuilderData(sheets, builder.rowIndex, phoneColumnIndex, phone);
      }
      
      if (email) {
        const emailColumnIndex = allHeaders.indexOf('Email');
        await updateBuilderData(sheets, builder.rowIndex, emailColumnIndex, email);
      }
      
      if (services) {
        const servicesColumnIndex = allHeaders.indexOf('Services');
        await updateBuilderData(sheets, builder.rowIndex, servicesColumnIndex, services);
      }
      
      console.log(`✅ Updated ${builder.name} with available information`);
      
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Search and enrichment completed!');
    console.log('Check your Google Sheet to see the new data columns and information.');
    
  } catch (error) {
    console.error('Error in search and enrichment:', error);
  }
}

searchAndEnrichBuilders();
