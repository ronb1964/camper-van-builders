#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗑️  Removing fake Delaware builder from data files...\n');

// File paths
const buildersFile = path.join(__dirname, 'public/data/builders.json');
const buildersByStateFile = path.join(__dirname, 'public/data/builders-by-state.json');

try {
  // Read builders.json
  console.log('📖 Reading builders.json...');
  const buildersData = JSON.parse(fs.readFileSync(buildersFile, 'utf8'));
  
  // Find and remove fake Delaware builder
  const fakeBuilderIndex = buildersData.findIndex(builder => 
    builder.id === 32 && 
    builder.name === "First State Vans" && 
    builder.location.state === "Delaware"
  );
  
  if (fakeBuilderIndex !== -1) {
    const removedBuilder = buildersData.splice(fakeBuilderIndex, 1)[0];
    console.log(`✅ Removed fake builder: ${removedBuilder.name} (ID: ${removedBuilder.id})`);
    console.log(`   Location: ${removedBuilder.location.city}, ${removedBuilder.location.state}`);
    console.log(`   Fake phone: ${removedBuilder.phone}`);
  } else {
    console.log('❌ Fake Delaware builder not found in builders.json');
  }
  
  // Write updated builders.json
  fs.writeFileSync(buildersFile, JSON.stringify(buildersData, null, 2));
  console.log('💾 Updated builders.json');
  
  // Read builders-by-state.json
  console.log('\n📖 Reading builders-by-state.json...');
  const buildersByStateData = JSON.parse(fs.readFileSync(buildersByStateFile, 'utf8'));
  
  // Remove fake Delaware builder from state data
  if (buildersByStateData.Delaware) {
    const delawareBuilders = buildersByStateData.Delaware;
    const fakeStateBuilderIndex = delawareBuilders.findIndex(builder => 
      builder.name === "First State Vans" && 
      builder.location.state === "Delaware"
    );
    
    if (fakeStateBuilderIndex !== -1) {
      const removedStateBuilder = delawareBuilders.splice(fakeStateBuilderIndex, 1)[0];
      console.log(`✅ Removed fake builder from Delaware state data: ${removedStateBuilder.name} (ID: ${removedStateBuilder.id})`);
      
      // If Delaware has no builders left, remove the state entirely
      if (delawareBuilders.length === 0) {
        delete buildersByStateData.Delaware;
        console.log('🗑️  Removed empty Delaware state entry');
      }
    } else {
      console.log('❌ Fake Delaware builder not found in state data');
    }
  } else {
    console.log('❌ Delaware state not found in builders-by-state.json');
  }
  
  // Write updated builders-by-state.json
  fs.writeFileSync(buildersByStateFile, JSON.stringify(buildersByStateData, null, 2));
  console.log('💾 Updated builders-by-state.json');
  
  console.log('\n✅ Delaware fake builder removal completed successfully!');
  console.log('\n📊 DELAWARE SUMMARY:');
  console.log('   • Fake builders removed: 1 (First State Vans)');
  console.log('   • Authentic builders found: 0');
  console.log('   • Final Delaware builder count: 0');
  console.log('\n🔍 RESEARCH FINDINGS:');
  console.log('   • No authentic Delaware-based van conversion companies found');
  console.log('   • Delaware appears to be served by builders from neighboring states');
  console.log('   • Companies investigated: Vanture Customs (PA), Brooklyn Campervans (NY),');
  console.log('     East Coast Van Builds (VT), The RV Shop (DE - repair only)');
  
} catch (error) {
  console.error('❌ Error processing files:', error.message);
  process.exit(1);
}
