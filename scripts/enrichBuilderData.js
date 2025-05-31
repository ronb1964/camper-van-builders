/**
 * 🤖 AI-Powered Builder Data Enrichment Tool
 * 
 * This script will:
 * 1. Read your current builder list
 * 2. Search Google Places for each builder
 * 3. Use AI to enhance and structure the data
 * 4. Output enriched data that you can copy back to your Google Sheet
 * 
 * BEGINNER-FRIENDLY: Each step is clearly explained!
 */

// ===== CONFIGURATION (You'll need to set these up) =====

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY_HERE';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_KEY_HERE';

// ===== REQUIRED PACKAGES =====
// Run: npm install axios dotenv
// (We'll help you install these!)

const axios = require('axios');
require('dotenv').config();

// ===== SAMPLE BUILDER DATA =====
// Replace this with your actual builder names from Google Sheets
const BUILDERS_TO_RESEARCH = [
  { name: "VanDoIt", state: "New Jersey" },
  { name: "New Jersey Van Conversions", state: "New Jersey" },
  { name: "East Coast Van Conversions", state: "New Jersey" },
  { name: "VanCraft", state: "New Jersey" },
  { name: "Jersey Van Works", state: "New Jersey" },
  { name: "Custom Van Solutions", state: "New Jersey" },
  { name: "Van Conversion Specialists", state: "New Jersey" },
  { name: "NJ Van Conversions", state: "New Jersey" },
  { name: "Liberty Van Conversions", state: "New Jersey" },
  { name: "Garden State Van Conversions", state: "New Jersey" },
  { name: "Humble Road", state: "New Jersey" },
  { name: "Ready.Set.Van", state: "New Jersey" },
  { name: "Sequoia + Salt", state: "New Jersey" }
];

// ===== MAIN FUNCTIONS =====

/**
 * 🔍 Step 1: Search Google Places for a builder
 */
async function searchGooglePlaces(builderName, state) {
  console.log(`🔍 Searching for: ${builderName} in ${state}...`);
  
  try {
    const searchQuery = `${builderName} camper van conversion ${state}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    
    const response = await axios.get(url, {
      params: {
        query: searchQuery,
        key: GOOGLE_PLACES_API_KEY,
        fields: 'place_id,name,formatted_address,rating,user_ratings_total'
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const place = response.data.results[0]; // Get the first (most relevant) result
      console.log(`✅ Found: ${place.name}`);
      return place;
    } else {
      console.log(`❌ No results found for ${builderName}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error searching for ${builderName}:`, error.message);
    return null;
  }
}

/**
 * 📍 Step 2: Get detailed information about a place
 */
async function getPlaceDetails(placeId) {
  console.log(`📍 Getting detailed info for place ID: ${placeId}...`);
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    
    const response = await axios.get(url, {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
        fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,opening_hours,geometry,business_status'
      }
    });

    if (response.data.result) {
      console.log(`✅ Got detailed info for: ${response.data.result.name}`);
      return response.data.result;
    } else {
      console.log(`❌ No detailed info found`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error getting place details:`, error.message);
    return null;
  }
}

/**
 * 🤖 Step 3: Use AI to enhance the data
 */
async function enhanceWithAI(builderData) {
  console.log(`🤖 Enhancing data with AI for: ${builderData.name}...`);
  
  // For now, we'll structure the data manually
  // Later we can add OpenAI integration for more advanced enhancement
  
  const enhanced = {
    // Basic Info
    name: builderData.name,
    address: builderData.formatted_address || '',
    phone: builderData.formatted_phone_number || '',
    website: builderData.website || '',
    
    // Location (for map markers!)
    latitude: builderData.geometry?.location?.lat || null,
    longitude: builderData.geometry?.location?.lng || null,
    
    // Business Info
    rating: builderData.rating || null,
    reviewCount: builderData.user_ratings_total || 0,
    businessStatus: builderData.business_status || 'UNKNOWN',
    
    // Hours
    isOpen: builderData.opening_hours?.open_now || null,
    hours: builderData.opening_hours?.weekday_text || [],
    
    // Reviews (first 3)
    recentReviews: builderData.reviews ? 
      builderData.reviews.slice(0, 3).map(review => ({
        rating: review.rating,
        text: review.text,
        author: review.author_name,
        time: review.relative_time_description
      })) : []
  };
  
  console.log(`✅ Enhanced data for: ${enhanced.name}`);
  return enhanced;
}

/**
 * 🚀 Main function: Research all builders
 */
async function researchAllBuilders() {
  console.log('🚀 Starting builder research...\n');
  
  const enrichedBuilders = [];
  
  for (const builder of BUILDERS_TO_RESEARCH) {
    console.log(`\n--- Researching ${builder.name} ---`);
    
    // Step 1: Search Google Places
    const searchResult = await searchGooglePlaces(builder.name, builder.state);
    
    if (searchResult && searchResult.place_id) {
      // Step 2: Get detailed info
      const detailedInfo = await getPlaceDetails(searchResult.place_id);
      
      if (detailedInfo) {
        // Step 3: Enhance with AI
        const enhanced = await enhanceWithAI(detailedInfo);
        enrichedBuilders.push(enhanced);
      }
    }
    
    // Be nice to the API - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Research complete!');
  console.log('\n📊 ENRICHED BUILDER DATA:');
  console.log('='.repeat(50));
  console.log(JSON.stringify(enrichedBuilders, null, 2));
  
  return enrichedBuilders;
}

// ===== ERROR HANDLING =====
function checkConfiguration() {
  if (GOOGLE_PLACES_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set up your Google Places API key!');
    console.log('📝 Instructions:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Enable the Places API');
    console.log('3. Create an API key');
    console.log('4. Add it to your .env file as GOOGLE_PLACES_API_KEY=your_key_here');
    return false;
  }
  return true;
}

// ===== RUN THE SCRIPT =====
if (require.main === module) {
  if (checkConfiguration()) {
    researchAllBuilders()
      .then(() => {
        console.log('\n✅ All done! Copy the JSON data above to enhance your Google Sheet.');
      })
      .catch(error => {
        console.error('❌ Error:', error.message);
      });
  }
}

module.exports = {
  searchGooglePlaces,
  getPlaceDetails,
  enhanceWithAI,
  researchAllBuilders
};
