const fs = require('fs');

// Read current builders.json
const buildersData = JSON.parse(fs.readFileSync('./public/data/builders.json', 'utf8'));

// New builders to add
const newBuilders = [
  {
    "id": 24,
    "name": "So-Cal Van Conversion",
    "address": "136 N 10th Street, Suite A, Ramona, CA 92065",
    "location": {
      "city": "Ramona",
      "state": "California",
      "lat": 33.0420,
      "lng": -116.8678,
      "zip": "92065"
    },
    "phone": "(760) 703-9025",
    "email": "so.cal_vanconversions@yahoo.com",
    "website": "https://so-calvans.com/",
    "description": "At So-Cal Van Conversions we strive to provide affordable conversion options for individuals and businesses. We build your vision, whether it's a weekend camper, mobile massage parlor, dog grooming van or your daily driver.",
    "vanTypes": ["Mercedes Sprinter", "Ford Transit", "Ram ProMaster"],
    "priceRange": {
      "min": 40000,
      "max": 120000
    },
    "amenities": [
      "Affordable Options",
      "Custom Builds",
      "Mobile Business Conversions",
      "Recreational Builds",
      "Work Van Conversions"
    ],
    "services": [
      "Custom Van Conversions",
      "Mobile Business Builds",
      "Weekend Camper Builds",
      "Commercial Van Conversions",
      "Consultation Services"
    ],
    "certifications": [],
    "leadTime": "3-6 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/100069979681852/",
      "instagram": null,
      "youtube": null
    },
    "gallery": []
  },
  {
    "id": 25,
    "name": "Vanspeed Shop",
    "address": "15192 Goldenwest Circle, Westminster, CA 92683",
    "location": {
      "city": "Westminster",
      "state": "California",
      "lat": 33.7594,
      "lng": -117.9939,
      "zip": "92683"
    },
    "phone": "(657) 227-8433",
    "email": null,
    "website": "https://www.vanspeedshop.com/",
    "description": "Premium Sprinter camper van conversions built in our 26,000 sq ft production facility. Mercedes Benz Expert Upfitters with 3 year/36,000 mile limited warranty. #1 rated van conversion company in Southern California.",
    "vanTypes": ["Mercedes Sprinter"],
    "priceRange": {
      "min": 150000,
      "max": 250000
    },
    "amenities": [
      "Premium Conversions",
      "26,000 Sq Ft Facility",
      "3 Year Warranty",
      "Expert Craftsmanship",
      "Nationwide Shipping"
    ],
    "services": [
      "Premium Sprinter Conversions",
      "Custom Builds",
      "Nationwide Shipping",
      "Warranty Service",
      "Parts & Accessories"
    ],
    "certifications": ["Mercedes Benz Expert Upfitters"],
    "leadTime": "4-8 months",
    "socialMedia": {
      "facebook": "https://www.facebook.com/VanspeedShop/",
      "instagram": "https://www.instagram.com/vanspeedshop/",
      "youtube": null
    },
    "gallery": [
      {
        "url": "https://www.vanspeedshop.com/cdn/shop/files/CA_COAST_b5b361d0-46e3-48e0-a105-4c000b0f2759.png?v=1748461024",
        "alt": "Vanspeed Shop California Coast Edition - Premium Sprinter Conversion",
        "caption": "California Coast Edition - Premium Sprinter conversion built in our 26,000 sq ft facility"
      },
      {
        "url": "https://www.vanspeedshop.com/cdn/shop/files/1_c3ed1316-592c-44df-b21f-7d6e7119ca27.png?v=1741986451",
        "alt": "Vanspeed Shop Custom Interior - Luxury Van Build",
        "caption": "Custom luxury interior featuring premium materials and expert craftsmanship"
      }
    ]
  }
];

// Find the position to insert (before Rocky Mountain Vans)
let insertIndex = -1;
for (let i = 0; i < buildersData.length; i++) {
  if (buildersData[i].name === "Rocky Mountain Vans") {
    insertIndex = i;
    break;
  }
}

if (insertIndex === -1) {
  console.log('❌ Could not find Rocky Mountain Vans to insert before');
  process.exit(1);
}

// Update IDs for Rocky Mountain Vans and subsequent builders
for (let i = insertIndex; i < buildersData.length; i++) {
  buildersData[i].id += 2; // Shift by 2 since we're adding 2 builders
}

// Insert new builders
buildersData.splice(insertIndex, 0, ...newBuilders);

console.log('✅ Added 2 new California builders to builders.json');
console.log('✅ Updated subsequent builder IDs');

// Write back to file
fs.writeFileSync('./public/data/builders.json', JSON.stringify(buildersData, null, 2));

console.log('💾 builders.json updated successfully');
console.log('📊 Total builders:', buildersData.length);
