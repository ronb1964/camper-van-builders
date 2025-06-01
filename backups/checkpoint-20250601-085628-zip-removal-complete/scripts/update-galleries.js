const fs = require('fs');

// Read the extracted photos
const exclusivePhotos = JSON.parse(fs.readFileSync('./california-exclusive-outfitters-photos.json', 'utf8'));
const vanspeedPhotos = JSON.parse(fs.readFileSync('./california-vanspeed-shop-photos.json', 'utf8'));

// Select the best photos for each builder
const exclusiveGallery = [
  {
    url: "https://www.exclusiveoutfitters.com/cdn/shop/files/1_174be5dd-f5c5-41d1-8eb9-9d0fdb412a40.jpg?v=1719186406",
    alt: "Exclusive Outfitters Model A - Luxury Sprinter Van Conversion",
    caption: "Model A - Premium Mercedes Sprinter conversion featuring luxury interior and adventure-ready systems"
  },
  {
    url: "https://www.exclusiveoutfitters.com/cdn/shop/files/1_1.jpg?v=1719465668",
    alt: "Exclusive Outfitters Model B - Mercedes Sprinter Interior",
    caption: "Model B - Spacious interior layout with premium finishes and overlanding equipment"
  },
  {
    url: "https://www.exclusiveoutfitters.com/cdn/shop/files/1revised.jpg?v=1719465838",
    alt: "Exclusive Outfitters Model C - Adventure Van Build",
    caption: "Model C - Custom Sprinter build designed for off-road adventures and extended travel"
  },
  {
    url: "https://www.exclusiveoutfitters.com/cdn/shop/files/1_1_a4cdb500-5a65-4714-a816-f2d7157903eb.jpg?v=1719465893",
    alt: "Exclusive Outfitters Model D - Professional Van Conversion",
    caption: "Model D - Professional-grade conversion with Mercedes authorized parts and service"
  }
];

const vanspeedGallery = [
  {
    url: "https://www.vanspeedshop.com/cdn/shop/files/CA_COAST_b5b361d0-46e3-48e0-a105-4c000b0f2759.png?v=1748461024",
    alt: "Vanspeed Shop California Coast Edition - Premium Sprinter Conversion",
    caption: "California Coast Edition - Premium Sprinter conversion built in our 26,000 sq ft facility"
  },
  {
    url: "https://www.vanspeedshop.com/cdn/shop/files/1_c3ed1316-592c-44df-b21f-7d6e7119ca27.png?v=1741986451",
    alt: "Vanspeed Shop Custom Interior - Luxury Van Build",
    caption: "Custom luxury interior featuring premium materials and expert craftsmanship"
  }
];

console.log('🎨 Gallery updates prepared for:');
console.log('✅ Exclusive Outfitters:', exclusiveGallery.length, 'photos');
console.log('✅ Vanspeed Shop:', vanspeedGallery.length, 'photos');

console.log('\n📝 Next steps:');
console.log('1. Update builders.json with gallery arrays');
console.log('2. Update builders-by-state.json with gallery arrays');
console.log('3. Update CSP to whitelist new image domains');
console.log('4. Test frontend rendering');

// Save gallery data for manual insertion
fs.writeFileSync('./exclusive-outfitters-gallery.json', JSON.stringify(exclusiveGallery, null, 2));
fs.writeFileSync('./vanspeed-shop-gallery.json', JSON.stringify(vanspeedGallery, null, 2));

console.log('\n💾 Gallery JSON files saved for manual insertion');
