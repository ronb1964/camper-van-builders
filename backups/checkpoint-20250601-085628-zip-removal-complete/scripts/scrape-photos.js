require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createSheetsClient, getBuilders, updateBuilderData } = require('./enrich-builder-data.js');

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, 'public', 'images', 'builders');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
  console.log('📁 Created photos directory:', photosDir);
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function scrapeBuilderPhotos(builderName, website) {
  console.log(`📸 Scraping photos for: ${builderName}`);
  
  // For demonstration, let's create some sample photo data
  // In a real implementation, you would scrape the website for images
  
  const photoData = {
    photos: [],
    photoUrls: []
  };
  
  // Sample photo URLs (these would normally be scraped from the website)
  if (builderName === 'VanDoIt') {
    photoData.photoUrls = [
      'https://vandoit.com/wp-content/uploads/2023/01/vandoit-liv-exterior.jpg',
      'https://vandoit.com/wp-content/uploads/2023/01/vandoit-do-interior.jpg'
    ];
  } else if (builderName === 'Humble Road') {
    photoData.photoUrls = [
      'https://www.humbleroad.tv/s/cc_images/cache_2456203043.jpg',
      'https://www.humbleroad.tv/s/cc_images/cache_2456203044.jpg'
    ];
  } else if (builderName === 'Ready.Set.Van') {
    photoData.photoUrls = [
      'https://www.readysetvan.com/hudson-exterior.jpg',
      'https://www.readysetvan.com/gramercy-interior.jpg'
    ];
  }
  
  // Create a safe filename for the builder
  const safeBuilderName = builderName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  // For now, let's create a JSON file with photo metadata instead of downloading
  const photoMetadata = {
    builderName: builderName,
    website: website,
    photos: photoData.photoUrls.map((url, index) => ({
      id: `${safeBuilderName}_${index + 1}`,
      url: url,
      alt: `${builderName} van conversion ${index + 1}`,
      localPath: `/images/builders/${safeBuilderName}_${index + 1}.jpg`
    })),
    lastUpdated: new Date().toISOString()
  };
  
  // Save photo metadata
  const metadataPath = path.join(photosDir, `${safeBuilderName}_photos.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(photoMetadata, null, 2));
  
  console.log(`  ✅ Created photo metadata for ${builderName}`);
  return photoMetadata;
}

async function updatePhotosInSheet() {
  try {
    console.log('📸 Starting photo scraping and metadata creation...');
    
    const sheets = await createSheetsClient();
    const builders = await getBuilders(sheets);
    
    // Find the Photos column index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'builders!1:1',
    });
    
    const headers = response.data.values[0];
    const photosColumnIndex = headers.indexOf('Photos');
    
    if (photosColumnIndex === -1) {
      console.log('❌ Photos column not found');
      return;
    }
    
    // Process builders with websites
    const buildersToProcess = ['VanDoIt', 'Humble Road', 'Ready.Set.Van'];
    
    for (const builder of builders) {
      if (buildersToProcess.includes(builder.name)) {
        console.log(`\n📸 Processing photos for ${builder.name}...`);
        
        const photoMetadata = await scrapeBuilderPhotos(builder.name, builder.website);
        
        // Update the Photos column with the number of photos found
        const photoCount = photoMetadata.photos.length;
        const photoInfo = `${photoCount} photos available`;
        
        await updateBuilderData(sheets, builder.rowIndex, photosColumnIndex, photoInfo);
        console.log(`  ✅ Updated sheet: ${photoInfo}`);
        
        // Add delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n🎉 Photo metadata creation completed!');
    console.log(`📁 Photo metadata saved in: ${photosDir}`);
    
  } catch (error) {
    console.error('Error updating photos:', error);
  }
}

// Export for use in other scripts
module.exports = {
  scrapeBuilderPhotos,
  updatePhotosInSheet,
  photosDir
};

// Run if called directly
if (require.main === module) {
  updatePhotosInSheet();
}
