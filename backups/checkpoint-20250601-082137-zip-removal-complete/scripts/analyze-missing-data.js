const fs = require('fs');

// Read the builders data
const buildersData = JSON.parse(fs.readFileSync('./public/data/builders.json', 'utf8'));

console.log('🔍 ANALYZING MISSING BUILDER INFORMATION\n');
console.log(`Total builders in database: ${buildersData.length}\n`);

const missingData = {
  phone: [],
  email: [],
  website: [],
  facebook: [],
  instagram: [],
  youtube: [],
  gallery: [],
  allSocialMedia: [],
  allContactInfo: []
};

const realBuilders = []; // Builders with websites (likely real companies)

buildersData.forEach(builder => {
  const hasPhone = builder.phone && builder.phone.trim() !== '';
  const hasEmail = builder.email && builder.email.trim() !== '';
  const hasWebsite = builder.website && builder.website.trim() !== '';
  const hasFacebook = builder.socialMedia?.facebook;
  const hasInstagram = builder.socialMedia?.instagram;
  const hasYoutube = builder.socialMedia?.youtube;
  const hasGallery = builder.gallery && builder.gallery.length > 0;

  // Track missing information
  if (!hasPhone) missingData.phone.push(builder);
  if (!hasEmail) missingData.email.push(builder);
  if (!hasWebsite) missingData.website.push(builder);
  if (!hasFacebook) missingData.facebook.push(builder);
  if (!hasInstagram) missingData.instagram.push(builder);
  if (!hasYoutube) missingData.youtube.push(builder);
  if (!hasGallery) missingData.gallery.push(builder);

  // Builders missing all social media
  if (!hasFacebook && !hasInstagram && !hasYoutube) {
    missingData.allSocialMedia.push(builder);
  }

  // Builders missing all contact info
  if (!hasPhone && !hasEmail && !hasWebsite) {
    missingData.allContactInfo.push(builder);
  }

  // Identify real builders (have websites)
  if (hasWebsite) {
    realBuilders.push({
      name: builder.name,
      website: builder.website,
      state: builder.location.state,
      hasPhone,
      hasEmail,
      hasFacebook,
      hasInstagram,
      hasYoutube,
      hasGallery
    });
  }
});

// Print summary
console.log('📊 MISSING INFORMATION SUMMARY:');
console.log(`├─ Missing Phone: ${missingData.phone.length} builders`);
console.log(`├─ Missing Email: ${missingData.email.length} builders`);
console.log(`├─ Missing Website: ${missingData.website.length} builders`);
console.log(`├─ Missing Facebook: ${missingData.facebook.length} builders`);
console.log(`├─ Missing Instagram: ${missingData.instagram.length} builders`);
console.log(`├─ Missing YouTube: ${missingData.youtube.length} builders`);
console.log(`├─ Missing Gallery: ${missingData.gallery.length} builders`);
console.log(`├─ Missing ALL Social Media: ${missingData.allSocialMedia.length} builders`);
console.log(`└─ Missing ALL Contact Info: ${missingData.allContactInfo.length} builders\n`);

console.log(`🌐 REAL BUILDERS WITH WEBSITES: ${realBuilders.length} builders\n`);

// Show real builders that need research
console.log('🎯 PRIORITY RESEARCH TARGETS (Real builders with websites):');
realBuilders.forEach((builder, index) => {
  const missing = [];
  if (!builder.hasPhone) missing.push('Phone');
  if (!builder.hasEmail) missing.push('Email');
  if (!builder.hasFacebook) missing.push('Facebook');
  if (!builder.hasInstagram) missing.push('Instagram');
  if (!builder.hasYoutube) missing.push('YouTube');
  if (!builder.hasGallery) missing.push('Gallery');

  if (missing.length > 0) {
    console.log(`${index + 1}. ${builder.name} (${builder.state})`);
    console.log(`   Website: ${builder.website}`);
    console.log(`   Missing: ${missing.join(', ')}\n`);
  }
});

// Show builders with no contact info at all
if (missingData.allContactInfo.length > 0) {
  console.log('\n❌ BUILDERS WITH NO CONTACT INFO (likely fake/placeholder):');
  missingData.allContactInfo.forEach((builder, index) => {
    console.log(`${index + 1}. ${builder.name} (${builder.location.state})`);
  });
}
