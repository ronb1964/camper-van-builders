/**
 * 🔍 Flexible Search Tool
 * 
 * This tries multiple search strategies to find builders
 * that might not have traditional Google Business listings
 */

require('dotenv').config();
const axios = require('axios');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const BUILDERS_TO_RESEARCH = [
  "VanDoIt",
  "New Jersey Van Conversions", 
  "East Coast Van Conversions",
  "VanCraft",
  "Jersey Van Works",
  "Custom Van Solutions",
  "Van Conversion Specialists",
  "NJ Van Conversions",
  "Liberty Van Conversions",
  "Garden State Van Conversions",
  "Humble Road",
  "Ready.Set.Van",
  "Sequoia + Salt"
];

async function flexibleSearch(builderName) {
  console.log(`\n🔍 Flexible search for: ${builderName}`);
  
  // Try different search strategies
  const searchStrategies = [
    `${builderName} New Jersey`,
    `${builderName} NJ`,
    `${builderName} camper van`,
    `${builderName} van conversion`,
    `${builderName}`,
    `${builderName} automotive`,
    `${builderName} custom`
  ];
  
  for (const query of searchStrategies) {
    console.log(`   Trying: "${query}"`);
    
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: query,
          key: GOOGLE_PLACES_API_KEY
        }
      });
      
      if (response.data.results && response.data.results.length > 0) {
        const results = response.data.results.slice(0, 3); // Top 3 results
        
        console.log(`   ✅ Found ${results.length} result(s):`);
        results.forEach((result, index) => {
          console.log(`      ${index + 1}. ${result.name}`);
          console.log(`         Address: ${result.formatted_address}`);
          console.log(`         Rating: ${result.rating || 'N/A'} (${result.user_ratings_total || 0} reviews)`);
        });
        
        return results;
      }
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log(`   ❌ No results found for ${builderName}`);
  return [];
}

async function searchAllBuilders() {
  console.log('🚀 Starting flexible search for all builders...\n');
  
  const allResults = {};
  
  for (const builder of BUILDERS_TO_RESEARCH) {
    const results = await flexibleSearch(builder);
    if (results.length > 0) {
      allResults[builder] = results;
    }
    
    // Wait between builders
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 SUMMARY OF FINDINGS:');
  console.log('='.repeat(50));
  
  Object.keys(allResults).forEach(builder => {
    console.log(`\n${builder}:`);
    allResults[builder].forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.name} - ${result.formatted_address}`);
    });
  });
  
  if (Object.keys(allResults).length === 0) {
    console.log('\n🤔 No builders found in Google Places.');
    console.log('💡 This suggests these might be:');
    console.log('   - Small businesses without Google listings');
    console.log('   - Home-based businesses');
    console.log('   - Businesses with different names online');
    console.log('   - New businesses not yet indexed');
  }
  
  return allResults;
}

// Run the flexible search
if (require.main === module) {
  searchAllBuilders()
    .then(() => {
      console.log('\n✅ Flexible search complete!');
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
    });
}

module.exports = { flexibleSearch, searchAllBuilders };
