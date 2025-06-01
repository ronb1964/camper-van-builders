#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Removing fake Peach State Vans (ID 35) from builders.json...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

function removeFakePeachState() {
  try {
    // Fix builders.json - remove Peach State Vans ID 35
    console.log('📖 Reading builders.json...');
    const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
    
    console.log('🗑️ Removing fake Peach State Vans (ID 35) from builders.json...');
    const originalCount = buildersData.length;
    const filteredBuilders = buildersData.filter(builder => !(builder.id === 35 && builder.name === "Peach State Vans"));
    const removedCount = originalCount - filteredBuilders.length;
    
    if (removedCount > 0) {
      fs.writeFileSync(buildersFile, JSON.stringify(filteredBuilders, null, 2));
      console.log(`   ✅ Removed ${removedCount} fake Peach State Vans entry from builders.json`);
      console.log('💾 Updated builders.json');
    } else {
      console.log('   ℹ️ No Peach State Vans found in builders.json');
    }
    
    // Check builders-by-state.json for Georgia section
    console.log('\n📖 Reading builders-by-state.json...');
    const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
    
    console.log('🔍 Checking Georgia section in builders-by-state.json...');
    if (buildersByStateData.Georgia) {
      const originalGeorgiaCount = buildersByStateData.Georgia.length;
      buildersByStateData.Georgia = buildersByStateData.Georgia.filter(builder => 
        !(builder.id === 35 && builder.name === "Peach State Vans")
      );
      const removedGeorgiaCount = originalGeorgiaCount - buildersByStateData.Georgia.length;
      
      if (removedGeorgiaCount > 0) {
        fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
        console.log(`   ✅ Removed ${removedGeorgiaCount} fake Peach State Vans from Georgia section`);
        console.log('💾 Updated builders-by-state.json');
      } else {
        console.log('   ℹ️ No Peach State Vans found in Georgia section');
      }
      
      console.log(`\n📊 Georgia now has ${buildersByStateData.Georgia.length} builders:`);
      buildersByStateData.Georgia.forEach(builder => {
        console.log(`   • ${builder.name} (ID: ${builder.id})`);
      });
    }
    
    console.log('\n✅ Fake Peach State Vans removal completed successfully!');
    console.log('\n🔧 DATA INTEGRITY FIXED:');
    console.log('   • Removed duplicate/fake Peach State Vans (ID 35)');
    console.log('   • Georgia should now show only 3 authentic builders');
    console.log('   • Frontend should refresh to show correct data');
    
  } catch (error) {
    console.error('❌ Error removing fake Peach State Vans:', error.message);
    process.exit(1);
  }
}

removeFakePeachState();
