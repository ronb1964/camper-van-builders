const fs = require('fs');

// Read current builders-by-state.json
const stateData = JSON.parse(fs.readFileSync('./public/data/builders-by-state.json', 'utf8'));

// New builders to add to California
const newCaliforniaBuilders = [
  {
    "id": 25,
    "name": "So-Cal Van Conversion",
    "address": "136 N 10th Street, Suite A, Ramona, CA 92065",
    "city": "Ramona",
    "state": "CA",
    "zipCode": "92065",
    "country": "USA",
    "coordinates": {
      "lat": 33.0420,
      "lng": -116.8678
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
    "id": 26,
    "name": "Vanspeed Shop",
    "address": "15192 Goldenwest Circle, Westminster, CA 92683",
    "city": "Westminster",
    "state": "CA",
    "zipCode": "92683",
    "country": "USA",
    "coordinates": {
      "lat": 33.7594,
      "lng": -117.9939
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

// Add to California array
if (stateData.California) {
  stateData.California.push(...newCaliforniaBuilders);
  console.log('✅ Added 2 new builders to California section');
  console.log('📊 California now has', stateData.California.length, 'builders');
} else {
  console.log('❌ California section not found');
  process.exit(1);
}

// Write back to file
fs.writeFileSync('./public/data/builders-by-state.json', JSON.stringify(stateData, null, 2));

console.log('💾 builders-by-state.json updated successfully');
