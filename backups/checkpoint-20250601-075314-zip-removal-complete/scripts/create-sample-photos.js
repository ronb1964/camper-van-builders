const fs = require('fs');
const path = require('path');

// Create sample photo URLs for demonstration
const samplePhotos = {
  'vandoit': [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
  ],
  'humble_road': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop'
  ],
  'ready_set_van': [
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  ]
};

// Create the photos directory structure
const photosDir = path.join(__dirname, 'public', 'images', 'builders');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Create photo metadata files
Object.entries(samplePhotos).forEach(([builderKey, photos]) => {
  const builderName = builderKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const photoMetadata = {
    builderName: builderName,
    photos: photos.map((url, index) => ({
      id: `${builderKey}_${index + 1}`,
      url: url,
      alt: `${builderName} van conversion ${index + 1}`,
      localPath: `/images/builders/${builderKey}_${index + 1}.jpg`
    })),
    lastUpdated: new Date().toISOString()
  };
  
  const metadataPath = path.join(photosDir, `${builderKey}_photos.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(photoMetadata, null, 2));
  
  console.log(`✅ Created photo metadata for ${builderName}`);
});

console.log('\n🎉 Sample photo metadata created successfully!');
console.log('📁 Files created in:', photosDir);
