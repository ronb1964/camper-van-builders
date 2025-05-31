#!/usr/bin/env node

/**
 * 🛠️ Builder Management Tool
 * 
 * Interactive tool to research and add new van builders
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load our Google Places API functions
const { searchPlaces, getPlaceDetails } = require('./enrichBuilderData');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function searchForBuilder() {
  console.log('\n🔍 SEARCH FOR NEW BUILDER');
  console.log('='.repeat(40));
  
  const builderName = await question('Enter builder name: ');
  const location = await question('Enter location (city, state): ');
  
  console.log(`\n🔍 Searching for "${builderName}" in ${location}...`);
  
  try {
    // Search using Google Places API
    const searchQuery = `${builderName} van conversion ${location}`;
    console.log(`📍 Search query: ${searchQuery}`);
    
    // You would call your Google Places API here
    console.log('⚠️  Google Places API search would go here');
    console.log('💡 For now, use manual research methods');
    
    await manualResearchGuide(builderName, location);
    
  } catch (error) {
    console.error('❌ Search error:', error.message);
    await manualResearchGuide(builderName, location);
  }
}

async function manualResearchGuide(builderName, location) {
  console.log(`\n📚 MANUAL RESEARCH GUIDE FOR: ${builderName}`);
  console.log('='.repeat(50));
  
  const searchQueries = [
    `"${builderName}" van conversion ${location}`,
    `"${builderName}" camper van ${location}`,
    `"${builderName}" RV conversion ${location}`,
    `${builderName} van builder ${location}`,
    `${builderName} custom van ${location}`
  ];
  
  console.log('🔍 Try these search queries:');
  searchQueries.forEach((query, index) => {
    console.log(`   ${index + 1}. ${query}`);
  });
  
  console.log('\n🌐 Search these platforms:');
  console.log('   • Google Search');
  console.log('   • Facebook Business Pages');
  console.log('   • Instagram Business');
  console.log('   • LinkedIn Company Pages');
  console.log('   • Yelp Business');
  console.log('   • Better Business Bureau');
  console.log('   • Local Chamber of Commerce');
  
  const found = await question('\nDid you find the builder? (y/n): ');
  
  if (found.toLowerCase() === 'y') {
    await collectBuilderInfo(builderName);
  } else {
    console.log('💡 Try different search terms or check if they\'re still in business');
  }
}

async function collectBuilderInfo(defaultName = '') {
  console.log('\n📝 COLLECT BUILDER INFORMATION');
  console.log('='.repeat(40));
  
  const builder = {};
  
  builder.name = await question(`Builder name [${defaultName}]: `) || defaultName;
  builder.address = await question('Full address: ');
  builder.phone = await question('Phone number: ');
  builder.email = await question('Email (optional): ');
  builder.website = await question('Website: ');
  builder.city = await question('City: ');
  builder.state = await question('State: ');
  builder.zip = await question('ZIP code: ');
  
  // Get coordinates
  console.log('\n📍 For coordinates, you can:');
  console.log('   1. Use Google Maps (right-click → "What\'s here?")');
  console.log('   2. Use GPS coordinates from the address');
  console.log('   3. Estimate based on city center');
  
  builder.lat = parseFloat(await question('Latitude: '));
  builder.lng = parseFloat(await question('Longitude: '));
  
  builder.description = await question('Description: ');
  builder.rating = parseFloat(await question('Rating (1-5): ')) || 5.0;
  builder.reviewCount = parseInt(await question('Review count: ')) || 0;
  
  // Van types
  console.log('\n🚐 Common van types: Ford Transit, Mercedes Sprinter, RAM Promaster, Nissan NV200');
  const vanTypesInput = await question('Van types (comma-separated): ');
  builder.vanTypes = vanTypesInput.split(',').map(type => type.trim()).filter(type => type);
  
  // Price range
  builder.priceMin = parseInt(await question('Minimum price: ')) || 30000;
  builder.priceMax = parseInt(await question('Maximum price: ')) || 150000;
  
  // Amenities
  console.log('\n🏠 Common amenities: Kitchen, Bathroom, Solar, Heating, AC, Storage');
  const amenitiesInput = await question('Amenities (comma-separated): ');
  builder.amenities = amenitiesInput.split(',').map(amenity => amenity.trim()).filter(amenity => amenity);
  
  // Services
  console.log('\n🔧 Common services: Custom Builds, Electrical, Plumbing, Interior Design');
  const servicesInput = await question('Services (comma-separated): ');
  builder.services = servicesInput.split(',').map(service => service.trim()).filter(service => service);
  
  // Show summary
  console.log('\n📋 BUILDER SUMMARY:');
  console.log('='.repeat(30));
  console.log(`Name: ${builder.name}`);
  console.log(`Location: ${builder.city}, ${builder.state}`);
  console.log(`Website: ${builder.website}`);
  console.log(`Phone: ${builder.phone}`);
  console.log(`Coordinates: ${builder.lat}, ${builder.lng}`);
  console.log(`Price Range: $${builder.priceMin.toLocaleString()} - $${builder.priceMax.toLocaleString()}`);
  
  const confirm = await question('\nAdd this builder? (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    await addBuilderToApp(builder);
  } else {
    console.log('❌ Builder not added');
  }
}

async function addBuilderToApp(builderData) {
  console.log('\n➕ ADDING BUILDER TO APP');
  console.log('='.repeat(30));
  
  try {
    // Read current mock data
    const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
    let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
    
    // Extract current builders array
    const buildersMatch = mockDataContent.match(/export const mockBuilders: MockBuilder\[\] = (\[[\s\S]*?\]);/);
    
    if (!buildersMatch) {
      throw new Error('Could not find mockBuilders array in file');
    }
    
    const currentBuildersStr = buildersMatch[1];
    const currentBuilders = JSON.parse(currentBuildersStr);
    
    // Generate new ID
    const newId = Math.max(...currentBuilders.map(b => b.id)) + 1;
    
    // Create new builder object
    const newBuilder = {
      id: newId,
      name: builderData.name,
      address: builderData.address,
      phone: builderData.phone,
      email: builderData.email || "",
      website: builderData.website,
      city: builderData.city,
      state: builderData.state,
      zip: builderData.zip || "",
      lat: builderData.lat,
      lng: builderData.lng,
      description: builderData.description,
      rating: builderData.rating,
      reviewCount: builderData.reviewCount,
      vanTypes: builderData.vanTypes,
      priceMin: builderData.priceMin,
      priceMax: builderData.priceMax,
      amenities: builderData.amenities,
      services: builderData.services
    };
    
    // Add to array
    currentBuilders.push(newBuilder);
    
    // Update the file content
    const newBuildersStr = JSON.stringify(currentBuilders, null, 2);
    const newContent = mockDataContent.replace(
      /export const mockBuilders: MockBuilder\[\] = \[[\s\S]*?\];/,
      `export const mockBuilders: MockBuilder[] = ${newBuildersStr};`
    );
    
    // Write back to file
    fs.writeFileSync(mockDataPath, newContent);
    
    console.log(`✅ Added ${builderData.name} to the app!`);
    console.log(`📊 Total builders: ${currentBuilders.length}`);
    console.log('🔄 Restart your app to see the new builder');
    
  } catch (error) {
    console.error('❌ Error adding builder:', error.message);
  }
}

async function listCurrentBuilders() {
  console.log('\n📊 CURRENT BUILDERS IN APP');
  console.log('='.repeat(40));
  
  try {
    const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
    const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
    
    const buildersMatch = mockDataContent.match(/export const mockBuilders: MockBuilder\[\] = (\[[\s\S]*?\]);/);
    
    if (buildersMatch) {
      const builders = JSON.parse(buildersMatch[1]);
      
      console.log(`Total builders: ${builders.length}\n`);
      
      const byState = {};
      builders.forEach(builder => {
        if (!byState[builder.state]) {
          byState[builder.state] = [];
        }
        byState[builder.state].push(builder);
      });
      
      Object.entries(byState).forEach(([state, stateBuilders]) => {
        console.log(`📍 ${state} (${stateBuilders.length}):`);
        stateBuilders.forEach(builder => {
          console.log(`   • ${builder.name} - ${builder.city}`);
        });
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error reading builders:', error.message);
  }
}

async function mainMenu() {
  console.log('\n🛠️ BUILDER MANAGEMENT TOOL');
  console.log('='.repeat(40));
  console.log('1. Search for new builder');
  console.log('2. Add builder manually');
  console.log('3. List current builders');
  console.log('4. Exit');
  
  const choice = await question('\nSelect option (1-4): ');
  
  switch (choice) {
    case '1':
      await searchForBuilder();
      break;
    case '2':
      await collectBuilderInfo();
      break;
    case '3':
      await listCurrentBuilders();
      break;
    case '4':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid option');
  }
  
  // Show menu again
  await mainMenu();
}

// Start the tool
if (require.main === module) {
  console.log('🚐 Welcome to the Van Builder Management Tool!');
  mainMenu().catch(error => {
    console.error('❌ Tool error:', error.message);
    rl.close();
  });
}

module.exports = {
  searchForBuilder,
  collectBuilderInfo,
  addBuilderToApp,
  listCurrentBuilders
};
