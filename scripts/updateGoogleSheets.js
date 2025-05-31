/**
 * 📊 Google Sheets Update Helper
 * 
 * This creates the exact data format you need for your Google Sheets
 */

// Verified builder data with complete information
const VERIFIED_BUILDERS = [
  {
    name: "Ready Set Van",
    address: "1800 E State St Suite 165, Hamilton Township, NJ 08609, USA",
    phone: "(609) 878-8822",
    website: "http://www.readysetvan.com/",
    latitude: 40.2346801,
    longitude: -74.7313461,
    rating: 5.0,
    reviewCount: 29,
    state: "New Jersey",
    businessStatus: "OPERATIONAL"
  },
  {
    name: "Sequoia + Salt - Conversion Vans",
    address: "202 E Main St Unit 1, Manasquan, NJ 08736, USA",
    phone: "(732) 357-3483",
    website: "https://sequoiasaltvans.com/",
    latitude: 40.121863,
    longitude: -74.046628,
    rating: 4.9,
    reviewCount: 51,
    state: "New Jersey",
    businessStatus: "OPERATIONAL"
  },
  {
    name: "Diversified Vehicle Services",
    address: "7300 N Crescent Blvd Unit 1B, Pennsauken Township, NJ 08110, USA",
    phone: "(856) 404-2694",
    website: "http://www.dvsnj.com/",
    latitude: 39.9684429,
    longitude: -75.04443169999999,
    rating: 4.8,
    reviewCount: 22,
    state: "New Jersey",
    businessStatus: "OPERATIONAL"
  },
  {
    name: "HQ Custom Design",
    address: "275 Huyler St, South Hackensack, NJ 07606, USA",
    phone: "(201) 592-6939",
    website: "http://www.hqcustomdesign.com/",
    latitude: 40.8705744,
    longitude: -74.0493371,
    rating: 4.4,
    reviewCount: 30,
    state: "New Jersey",
    businessStatus: "OPERATIONAL"
  },
  {
    name: "Vanture Customs",
    address: "725 County Line Rd STE C, Huntingdon Valley, PA 19006, USA",
    phone: "(814) 320-4253",
    website: "https://vanturecustoms.com/",
    latitude: 40.16207859999999,
    longitude: -75.05427,
    rating: 5.0,
    reviewCount: 107,
    state: "Pennsylvania",
    businessStatus: "OPERATIONAL"
  }
];

function generateGoogleSheetsFormat() {
  console.log('📊 GOOGLE SHEETS DATA - COPY AND PASTE THIS:');
  console.log('='.repeat(80));
  
  // Headers
  const headers = [
    'Name',
    'State', 
    'Address',
    'Phone',
    'Website',
    'Latitude',
    'Longitude',
    'Rating',
    'Review Count',
    'Business Status'
  ];
  
  console.log(headers.join('\t'));
  
  // Data rows
  VERIFIED_BUILDERS.forEach(builder => {
    const row = [
      builder.name,
      builder.state,
      builder.address,
      builder.phone,
      builder.website,
      builder.latitude,
      builder.longitude,
      builder.rating,
      builder.reviewCount,
      builder.businessStatus
    ];
    console.log(row.join('\t'));
  });
  
  console.log('='.repeat(80));
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Select all the data above (from Name to the last row)');
  console.log('2. Copy it (Ctrl+C)');
  console.log('3. Go to your Google Sheets');
  console.log('4. Select cell A1');
  console.log('5. Paste (Ctrl+V)');
  console.log('6. Google Sheets will automatically separate into columns!');
  
  return VERIFIED_BUILDERS;
}

function generateCSVFormat() {
  console.log('\n📄 CSV FORMAT (Alternative):');
  console.log('='.repeat(50));
  
  const headers = ['Name', 'State', 'Address', 'Phone', 'Website', 'Latitude', 'Longitude', 'Rating', 'Review Count', 'Business Status'];
  console.log(headers.map(h => `"${h}"`).join(','));
  
  VERIFIED_BUILDERS.forEach(builder => {
    const row = [
      builder.name,
      builder.state,
      builder.address,
      builder.phone,
      builder.website,
      builder.latitude,
      builder.longitude,
      builder.rating,
      builder.reviewCount,
      builder.businessStatus
    ];
    console.log(row.map(field => `"${field}"`).join(','));
  });
}

// Run both formats
if (require.main === module) {
  generateGoogleSheetsFormat();
  generateCSVFormat();
  
  console.log('\n✅ Data ready for Google Sheets!');
  console.log('🗺️  This data includes perfect coordinates for your map markers!');
}

module.exports = { VERIFIED_BUILDERS, generateGoogleSheetsFormat };
