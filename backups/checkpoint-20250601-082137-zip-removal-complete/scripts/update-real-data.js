require('dotenv').config();
const { createSheetsClient, getBuilders, updateBuilderData } = require('./enrich-builder-data.js');

async function updateWithRealData() {
  try {
    console.log('🔍 Updating Google Sheet with real builder data...');
    
    const sheets = await createSheetsClient();
    const builders = await getBuilders(sheets);
    
    // Real data found from web searches
    const realData = {
      'VanDoIt': {
        website: 'https://vandoit.com',
        phone: '(816) 944-2229',
        email: 'kaylee@vandoit.com',
        services: 'Modular Ford Transit Camper Vans, MOOV/LIV/DO Models, Custom Builds'
      },
      'Humble Road': {
        website: 'https://www.humbleroad.tv',
        phone: 'Contact via email',
        email: 'georgemauro@humbleroad.tv',
        services: 'Custom Tailored Camper Vans, Mini-Me Micro Campers, Solo Traveler Builds'
      },
      'Ready.Set.Van': {
        website: 'https://www.readysetvan.com',
        phone: '(609) 878-8822',
        email: 'hello@readysetvan.com',
        services: 'Hudson, Gramercy, Highline, Basecamper, Joyride Models, Tesla Battery Systems'
      }
    };
    
    // Column indices (assuming headers are: State, Company Name, Location, Description, Website, Phone, Email, Services)
    const columnIndices = {
      website: 4, // Column E
      phone: 5,   // Column F
      email: 6,   // Column G
      services: 7 // Column H
    };
    
    for (const builder of builders) {
      const builderData = realData[builder.name];
      
      if (builderData) {
        console.log(`\n📝 Updating ${builder.name} with real data...`);
        
        // Update website
        if (builderData.website) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.website, builderData.website);
        }
        
        // Update phone
        if (builderData.phone) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.phone, builderData.phone);
        }
        
        // Update email
        if (builderData.email) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.email, builderData.email);
        }
        
        // Update services
        if (builderData.services) {
          await updateBuilderData(sheets, builder.rowIndex, columnIndices.services, builderData.services);
        }
        
        console.log(`✅ Updated ${builder.name} with real contact information`);
        
        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n🎉 Real data update completed!');
    console.log('Updated builders with verified contact information:');
    console.log('- VanDoIt: Real website, phone, email, and services');
    console.log('- Humble Road: Real website, email, and services');
    console.log('- Ready.Set.Van: Real website, phone, email, and services');
    
  } catch (error) {
    console.error('Error updating with real data:', error);
  }
}

updateWithRealData();
