/**
 * 🧪 Test Setup Script
 * 
 * This script tests if your API key is working correctly
 * Run this BEFORE running the main enrichment tool
 */

require('dotenv').config();
const axios = require('axios');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function testGooglePlacesAPI() {
  console.log('🧪 Testing Google Places API setup...\n');
  
  // Check if API key is set
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ API key not found!');
    console.log('📝 Please add your Google Places API key to the .env file:');
    console.log('   GOOGLE_PLACES_API_KEY=your_actual_key_here');
    return false;
  }
  
  console.log('✅ API key found in .env file');
  
  // Test API call with a simple search
  try {
    console.log('🔍 Testing API call...');
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: 'camper van conversion New Jersey',
        key: GOOGLE_PLACES_API_KEY
      }
    });
    
    if (response.data.status === 'OK') {
      console.log('✅ API is working!');
      console.log(`📊 Found ${response.data.results.length} results`);
      
      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        console.log(`📍 Example result: ${firstResult.name}`);
        console.log(`📍 Address: ${firstResult.formatted_address}`);
      }
      
      return true;
    } else {
      console.error('❌ API returned error:', response.data.status);
      console.error('   Error message:', response.data.error_message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    return false;
  }
}

// Run the test
testGooglePlacesAPI()
  .then(success => {
    if (success) {
      console.log('\n🎉 Setup test passed! You can now run the main enrichment tool.');
      console.log('💡 Next step: node scripts/enrichBuilderData.js');
    } else {
      console.log('\n❌ Setup test failed. Please fix the issues above and try again.');
    }
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
  });
