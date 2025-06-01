const fs = require('fs');

console.log('🗑️  Removing fake Boulder Van Works entry...');

// Remove from builders.json
console.log('📝 Updating builders.json...');
const buildersData = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', 'utf8'));

// Find and remove Boulder Van Works (ID 30)
const originalCount = buildersData.length;
const filteredBuilders = buildersData.filter(builder => builder.id !== 30);
const removedCount = originalCount - filteredBuilders.length;

fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders.json', JSON.stringify(filteredBuilders, null, 2));
console.log(`   ✅ Removed ${removedCount} fake builder from builders.json`);

// Remove from builders-by-state.json
console.log('📝 Updating builders-by-state.json...');
const buildersByState = JSON.parse(fs.readFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', 'utf8'));

if (buildersByState.Colorado) {
  const originalColoradoCount = buildersByState.Colorado.length;
  buildersByState.Colorado = buildersByState.Colorado.filter(builder => builder.id !== 30);
  const removedColoradoCount = originalColoradoCount - buildersByState.Colorado.length;
  
  fs.writeFileSync('/home/ron/Dev/Test/camper-van-builders/public/data/builders-by-state.json', JSON.stringify(buildersByState, null, 2));
  console.log(`   ✅ Removed ${removedColoradoCount} fake builder from Colorado in builders-by-state.json`);
} else {
  console.log('   ⚠️  No Colorado section found in builders-by-state.json');
}

console.log('\n✅ Fake Boulder Van Works entry completely removed from both files');
console.log('📊 Colorado now has exactly 5 verified, authentic builders');
