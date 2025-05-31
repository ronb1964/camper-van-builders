/**
 * 📊 CSV Output Version
 * 
 * This version outputs the enriched data as CSV format
 * that you can easily copy/paste into Google Sheets
 */

const { researchAllBuilders } = require('./enrichBuilderData');
const fs = require('fs');

function convertToCSV(enrichedBuilders) {
  // CSV Headers
  const headers = [
    'Name',
    'Address', 
    'Phone',
    'Website',
    'Latitude',
    'Longitude',
    'Rating',
    'Review Count',
    'Business Status',
    'Is Open Now',
    'Top Review'
  ];
  
  // Convert data to CSV rows
  const rows = enrichedBuilders.map(builder => [
    builder.name || '',
    builder.address || '',
    builder.phone || '',
    builder.website || '',
    builder.latitude || '',
    builder.longitude || '',
    builder.rating || '',
    builder.reviewCount || '',
    builder.businessStatus || '',
    builder.isOpen !== null ? (builder.isOpen ? 'Yes' : 'No') : '',
    builder.recentReviews && builder.recentReviews.length > 0 ? 
      `"${builder.recentReviews[0].text.substring(0, 100)}..."` : ''
  ]);
  
  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
}

async function enrichAndExportCSV() {
  console.log('🚀 Starting builder research and CSV export...\n');
  
  try {
    // Research all builders
    const enrichedBuilders = await researchAllBuilders();
    
    if (enrichedBuilders.length === 0) {
      console.log('❌ No builders were successfully researched.');
      return;
    }
    
    // Convert to CSV
    const csvContent = convertToCSV(enrichedBuilders);
    
    // Save to file
    const filename = `enriched-builders-${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(filename, csvContent);
    
    console.log('\n📊 CSV OUTPUT:');
    console.log('='.repeat(50));
    console.log(csvContent);
    console.log('='.repeat(50));
    
    console.log(`\n✅ Data saved to: ${filename}`);
    console.log('💡 You can now:');
    console.log('   1. Copy the CSV output above');
    console.log('   2. Paste it into Google Sheets');
    console.log('   3. Or open the saved CSV file');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  enrichAndExportCSV();
}

module.exports = { enrichAndExportCSV, convertToCSV };
