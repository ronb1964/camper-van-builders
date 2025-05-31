/**
 * 📍 Get Detailed Info for Found Builders
 * 
 * This gets complete details for the actual businesses we found
 */

require('dotenv').config();
const axios = require('axios');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Real businesses we found that do van conversions in NJ
const FOUND_BUILDERS = [
  { searchName: "Ready Set Van", location: "Hamilton Township, NJ" },
  { searchName: "Sequoia + Salt - Conversion Vans", location: "Manasquan, NJ" },
  { searchName: "Diversified Vehicle Services", location: "Pennsauken Township, NJ" },
  { searchName: "HQ Custom Design", location: "South Hackensack, NJ" },
  { searchName: "LAC Van Collection - New Jersey", location: "Rutherford, NJ" },
  { searchName: "Vanture Customs", location: "Huntingdon Valley, PA" }
];

async function getBuilderDetails(builderName, location) {
  console.log(`\n📍 Getting details for: ${builderName}`);
  
  try {
    // First, search to get place_id
    const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: `${builderName} ${location}`,
        key: GOOGLE_PLACES_API_KEY
      }
    });
    
    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      console.log(`❌ No results found for ${builderName}`);
      return null;
    }
    
    const place = searchResponse.data.results[0];
    console.log(`✅ Found: ${place.name}`);
    
    // Get detailed information
    const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: place.place_id,
        key: GOOGLE_PLACES_API_KEY,
        fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,opening_hours,geometry,business_status,types'
      }
    });
    
    const details = detailsResponse.data.result;
    
    // Structure the data
    const builderData = {
      name: details.name,
      address: details.formatted_address || '',
      phone: details.formatted_phone_number || '',
      website: details.website || '',
      latitude: details.geometry?.location?.lat || null,
      longitude: details.geometry?.location?.lng || null,
      rating: details.rating || null,
      reviewCount: details.user_ratings_total || 0,
      businessStatus: details.business_status || 'UNKNOWN',
      businessTypes: details.types || [],
      isOpen: details.opening_hours?.open_now || null,
      hours: details.opening_hours?.weekday_text || [],
      recentReviews: details.reviews ? 
        details.reviews.slice(0, 3).map(review => ({
          rating: review.rating,
          text: review.text.substring(0, 200) + '...',
          author: review.author_name,
          time: review.relative_time_description
        })) : []
    };
    
    console.log(`✅ Got complete details for: ${builderData.name}`);
    return builderData;
    
  } catch (error) {
    console.error(`❌ Error getting details for ${builderName}:`, error.message);
    return null;
  }
}

async function getAllBuilderDetails() {
  console.log('🚀 Getting detailed information for all found builders...\n');
  
  const enrichedBuilders = [];
  
  for (const builder of FOUND_BUILDERS) {
    const details = await getBuilderDetails(builder.searchName, builder.location);
    if (details) {
      enrichedBuilders.push(details);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Convert to CSV format
  const csvHeaders = [
    'Name', 'Address', 'Phone', 'Website', 'Latitude', 'Longitude', 
    'Rating', 'Review Count', 'Business Status', 'Is Open Now', 'Top Review'
  ];
  
  const csvRows = enrichedBuilders.map(builder => [
    builder.name,
    builder.address,
    builder.phone,
    builder.website,
    builder.latitude,
    builder.longitude,
    builder.rating,
    builder.reviewCount,
    builder.businessStatus,
    builder.isOpen !== null ? (builder.isOpen ? 'Yes' : 'No') : '',
    builder.recentReviews.length > 0 ? `"${builder.recentReviews[0].text}"` : ''
  ]);
  
  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  console.log('\n📊 ENRICHED BUILDER DATA (CSV FORMAT):');
  console.log('='.repeat(80));
  console.log(csvContent);
  console.log('='.repeat(80));
  
  console.log('\n✅ Research complete!');
  console.log('💡 Copy the CSV data above and paste it into Google Sheets');
  console.log('📍 These builders have verified addresses and coordinates for your map!');
  
  return enrichedBuilders;
}

// Run the detailed research
if (require.main === module) {
  getAllBuilderDetails()
    .catch(error => {
      console.error('❌ Error:', error.message);
    });
}

module.exports = { getAllBuilderDetails };
