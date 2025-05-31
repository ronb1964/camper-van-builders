/**
 * 🔍 Research Missing Builders
 * 
 * This helps research the builders that don't have Google Business listings
 * by providing search strategies and manual research guidance
 */

// Your original 13 builders
const ORIGINAL_BUILDERS = [
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
  "Ready.Set.Van", // ✅ Found as "Ready Set Van"
  "Sequoia + Salt"  // ✅ Found as "Sequoia + Salt - Conversion Vans"
];

// Builders we successfully found
const FOUND_BUILDERS = [
  "Ready.Set.Van",
  "Sequoia + Salt"
];

// Missing builders that need research
const MISSING_BUILDERS = ORIGINAL_BUILDERS.filter(builder => 
  !FOUND_BUILDERS.includes(builder)
);

function generateResearchGuide() {
  console.log('🔍 RESEARCH GUIDE FOR MISSING BUILDERS');
  console.log('='.repeat(60));
  
  console.log('\n📋 MISSING BUILDERS TO RESEARCH:');
  MISSING_BUILDERS.forEach((builder, index) => {
    console.log(`${index + 1}. ${builder}`);
  });
  
  console.log('\n🌐 RESEARCH STRATEGIES:');
  console.log('='.repeat(40));
  
  MISSING_BUILDERS.forEach(builder => {
    console.log(`\n🔍 ${builder}:`);
    console.log(`   Google Search: "${builder} van conversion New Jersey"`);
    console.log(`   Instagram: @${builder.toLowerCase().replace(/\s+/g, '')}`);
    console.log(`   Facebook: "${builder} van conversion"`);
    console.log(`   Website: ${builder.toLowerCase().replace(/\s+/g, '')}.com`);
    console.log(`   LinkedIn: "${builder}"`);
  });
  
  console.log('\n💡 WHAT TO LOOK FOR:');
  console.log('='.repeat(30));
  console.log('✅ Business website or social media');
  console.log('✅ Contact information (phone, email)');
  console.log('✅ Physical address or service area');
  console.log('✅ Portfolio of van conversions');
  console.log('✅ Customer reviews or testimonials');
  console.log('✅ Pricing information');
  
  console.log('\n📝 MANUAL RESEARCH TEMPLATE:');
  console.log('='.repeat(35));
  console.log('Copy this template for each builder you research:');
  console.log('');
  console.log('Builder Name: _______________');
  console.log('Website: _______________');
  console.log('Phone: _______________');
  console.log('Email: _______________');
  console.log('Address: _______________');
  console.log('Instagram: _______________');
  console.log('Facebook: _______________');
  console.log('Specialties: _______________');
  console.log('Notes: _______________');
  console.log('');
}

function generateWebSearchQueries() {
  console.log('\n🌐 WEB SEARCH QUERIES TO TRY:');
  console.log('='.repeat(40));
  
  MISSING_BUILDERS.forEach(builder => {
    console.log(`\n${builder}:`);
    console.log(`  • "${builder}" "van conversion" "New Jersey"`);
    console.log(`  • "${builder}" "camper van" NJ`);
    console.log(`  • "${builder}" "sprinter conversion"`);
    console.log(`  • "${builder}" "custom van build"`);
  });
}

function checkIfBuilderExists(builderName) {
  // This would be where we could integrate web search APIs
  // For now, we'll provide manual research guidance
  return {
    name: builderName,
    needsResearch: true,
    suggestedSearches: [
      `"${builderName}" "van conversion" "New Jersey"`,
      `"${builderName}" "camper van" NJ`,
      `${builderName} Instagram`,
      `${builderName} Facebook`
    ]
  };
}

// Run the research guide
if (require.main === module) {
  generateResearchGuide();
  generateWebSearchQueries();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('='.repeat(20));
  console.log('1. Use the search queries above to research each missing builder');
  console.log('2. Fill out the manual research template for each one you find');
  console.log('3. Add any real businesses you discover to your Google Sheets');
  console.log('4. Update your app with the new data');
  
  console.log('\n💡 TIP: Many small van conversion businesses operate primarily');
  console.log('   through social media (Instagram, Facebook) rather than');
  console.log('   traditional Google Business listings.');
}

module.exports = { MISSING_BUILDERS, generateResearchGuide };
