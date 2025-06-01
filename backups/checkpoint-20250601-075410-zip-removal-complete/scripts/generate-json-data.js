require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

async function generateJSONData() {
  try {
    console.log('🚀 Generating JSON data from Google Sheets...');
    
    const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID;
    
    if (!apiKey || !sheetId) {
      throw new Error('Missing Google Sheets API key or Sheet ID');
    }
    
    console.log('📊 Fetching builders from Google Sheets...');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/builders!A:R?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length === 0) {
      console.warn('⚠️ No data found in sheet');
      return;
    }
    
    console.log(`✅ Fetched ${rows.length - 1} builders from Google Sheets`);
    
    // Process builders data
    const builders = [];
    const buildersByState = {};
    
    // Skip header row and process data
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue; // Skip empty rows
      
      // Generate coordinates (simplified distribution around New Jersey)
      const lat = 40.0583 + (Math.random() - 0.5) * 2;
      const lng = -74.4057 + (Math.random() - 0.5) * 2;
      
      const builder = {
        id: i,
        name: row[0] || 'Unknown Builder',
        address: `${row[2] || 'Unknown City'}, ${row[3] || 'New Jersey'} ${row[4] || ''}`.trim(),
        location: {
          city: row[2] || 'Unknown City',
          state: row[3] || 'New Jersey',
          lat: lat,
          lng: lng,
          zip: row[4] || null
        },
        phone: row[7] || '',
        email: row[8] || '',
        website: row[6] || '',
        description: row[5] || '',
        vanTypes: ['Sprinter', 'Transit', 'Promaster'],
        priceRange: {
          min: 50000,
          max: 150000
        },
        amenities: ['Solar Power', 'Kitchen', 'Bathroom'],
        services: ['Custom Builds', 'Consultation'],
        certifications: [],
        leadTime: '4-8 months',
        socialMedia: {
          facebook: null,
          instagram: row[11] || null,  // Column L for Instagram
          youtube: row[10] || null     // Column K for YouTube
        },
        gallery: row[13] ? row[13].split(',').map(url => url.trim()).filter(url => url) : []  // Column N for photos
      };
      
      builders.push(builder);
      
      // Organize by state
      const state = builder.location.state;
      if (!buildersByState[state]) {
        buildersByState[state] = [];
      }
      buildersByState[state].push(builder);
    }
    
    // Create public/data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write all builders data
    fs.writeFileSync(
      path.join(dataDir, 'builders.json'),
      JSON.stringify(builders, null, 2)
    );
    
    // Write builders by state data
    fs.writeFileSync(
      path.join(dataDir, 'builders-by-state.json'),
      JSON.stringify(buildersByState, null, 2)
    );
    
    // Write states list
    const states = Object.keys(buildersByState).sort();
    fs.writeFileSync(
      path.join(dataDir, 'states.json'),
      JSON.stringify(states, null, 2)
    );
    
    console.log(`✅ Successfully generated JSON data:`);
    console.log(`   📄 builders.json - ${builders.length} builders`);
    console.log(`   📄 builders-by-state.json - ${states.length} states`);
    console.log(`   📄 states.json - States list`);
    
    // Verify New Jersey builders
    const njBuilders = buildersByState['New Jersey'] || [];
    console.log(`🔍 New Jersey builders: ${njBuilders.length}`);
    
    if (njBuilders.length > 0) {
      console.log('📋 New Jersey builders:');
      njBuilders.forEach((builder, index) => {
        console.log(`  ${index + 1}. ${builder.name} (${builder.location.city})`);
      });
    }
    
    console.log('\n🎉 JSON data generation completed successfully!');
    console.log('📁 Files saved to: public/data/');
    
  } catch (error) {
    console.error('❌ JSON generation failed:', error);
    throw error;
  }
}

generateJSONData()
  .then(() => {
    console.log('✅ JSON generation script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ JSON generation script failed:', error);
    process.exit(1);
  });
