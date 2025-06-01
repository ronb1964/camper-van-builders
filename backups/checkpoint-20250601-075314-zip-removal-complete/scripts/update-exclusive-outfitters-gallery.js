const fs = require('fs');

// Gallery for Exclusive Outfitters
const exclusiveGallery = [
  {
    "url": "https://www.exclusiveoutfitters.com/cdn/shop/files/1_174be5dd-f5c5-41d1-8eb9-9d0fdb412a40.jpg?v=1719186406",
    "alt": "Exclusive Outfitters Model A - Luxury Sprinter Van Conversion",
    "caption": "Model A - Premium Mercedes Sprinter conversion featuring luxury interior and adventure-ready systems"
  },
  {
    "url": "https://www.exclusiveoutfitters.com/cdn/shop/files/1_1.jpg?v=1719465668",
    "alt": "Exclusive Outfitters Model B - Mercedes Sprinter Interior",
    "caption": "Model B - Spacious interior layout with premium finishes and overlanding equipment"
  },
  {
    "url": "https://www.exclusiveoutfitters.com/cdn/shop/files/1revised.jpg?v=1719465838",
    "alt": "Exclusive Outfitters Model C - Adventure Van Build",
    "caption": "Model C - Custom Sprinter build designed for off-road adventures and extended travel"
  },
  {
    "url": "https://www.exclusiveoutfitters.com/cdn/shop/files/1_1_a4cdb500-5a65-4714-a816-f2d7157903eb.jpg?v=1719465893",
    "alt": "Exclusive Outfitters Model D - Professional Van Conversion",
    "caption": "Model D - Professional-grade conversion with Mercedes authorized parts and service"
  }
];

// Update builders.json
const buildersData = JSON.parse(fs.readFileSync('./public/data/builders.json', 'utf8'));
const exclusiveBuilder = buildersData.find(b => b.name === "Exclusive Outfitters");
if (exclusiveBuilder) {
  exclusiveBuilder.gallery = exclusiveGallery;
  console.log('✅ Updated Exclusive Outfitters gallery in builders.json');
} else {
  console.log('❌ Exclusive Outfitters not found in builders.json');
}

// Update builders-by-state.json
const stateData = JSON.parse(fs.readFileSync('./public/data/builders-by-state.json', 'utf8'));
const exclusiveStateBuilder = stateData.California?.find(b => b.name === "Exclusive Outfitters");
if (exclusiveStateBuilder) {
  exclusiveStateBuilder.gallery = exclusiveGallery;
  console.log('✅ Updated Exclusive Outfitters gallery in builders-by-state.json');
} else {
  console.log('❌ Exclusive Outfitters not found in California section');
}

// Write back to files
fs.writeFileSync('./public/data/builders.json', JSON.stringify(buildersData, null, 2));
fs.writeFileSync('./public/data/builders-by-state.json', JSON.stringify(stateData, null, 2));

console.log('💾 Gallery updates saved successfully');
console.log('🎨 Exclusive Outfitters now has', exclusiveGallery.length, 'authentic photos');
