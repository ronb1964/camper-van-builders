#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('🍑 Extracting gallery photos from Georgia van builders...\n');

const georgiaBuilders = [
  {
    id: 94,
    name: "Summit Vans LLC",
    website: "https://thesummitvans.com/",
    galleryPages: [
      "https://thesummitvans.com/vans",
      "https://thesummitvans.com/"
    ]
  },
  {
    id: 95,
    name: "Live More Campervans",
    website: "https://www.livemorecampervans.com/",
    galleryPages: [
      "https://www.livemorecampervans.com/buildgallery",
      "https://www.livemorecampervans.com/"
    ]
  },
  {
    id: 96,
    name: "Scamper RV Build & Design",
    website: "https://www.scamperrv.com/build",
    galleryPages: [
      "https://www.scamperrv.com/media",
      "https://www.scamperrv.com/build"
    ]
  }
];

async function extractPhotosFromBuilder(builder) {
  console.log(`\n📸 Extracting photos for ${builder.name}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  const photos = new Set();
  
  for (const pageUrl of builder.galleryPages) {
    try {
      console.log(`   🔍 Scanning: ${pageUrl}`);
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate with timeout
      await page.goto(pageUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      // Wait for images to load
      await page.waitForTimeout(3000);
      
      // Extract image URLs
      const imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
          .map(img => img.src)
          .filter(src => src && src.startsWith('http'))
          .filter(src => {
            const url = src.toLowerCase();
            return (url.includes('van') || url.includes('build') || url.includes('conversion') || 
                   url.includes('interior') || url.includes('gallery') || url.includes('custom')) &&
                   !url.includes('logo') && !url.includes('icon') && !url.includes('avatar') &&
                   (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp'));
          });
      });
      
      imageUrls.forEach(url => photos.add(url));
      console.log(`   ✅ Found ${imageUrls.length} relevant images`);
      
      await page.close();
      
    } catch (error) {
      console.log(`   ⚠️  Error scanning ${pageUrl}: ${error.message}`);
    }
  }
  
  await browser.close();
  
  const photoArray = Array.from(photos).slice(0, 8); // Limit to 8 photos per builder
  console.log(`   📊 Total unique photos extracted: ${photoArray.length}`);
  
  return {
    builderId: builder.id,
    builderName: builder.name,
    photos: photoArray
  };
}

async function extractAllPhotos() {
  const results = [];
  
  for (const builder of georgiaBuilders) {
    try {
      const result = await extractPhotosFromBuilder(builder);
      results.push(result);
    } catch (error) {
      console.error(`❌ Error extracting photos for ${builder.name}:`, error.message);
      results.push({
        builderId: builder.id,
        builderName: builder.name,
        photos: []
      });
    }
  }
  
  // Save results to JSON file
  const outputFile = path.join(__dirname, 'georgia-extracted-photos.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  
  console.log('\n✅ Photo extraction completed!');
  console.log(`💾 Results saved to: ${outputFile}`);
  
  // Summary
  console.log('\n📊 EXTRACTION SUMMARY:');
  results.forEach(result => {
    console.log(`   • ${result.builderName}: ${result.photos.length} photos`);
  });
  
  const totalPhotos = results.reduce((sum, result) => sum + result.photos.length, 0);
  console.log(`   • Total photos extracted: ${totalPhotos}`);
  
  return results;
}

// Run the extraction
extractAllPhotos().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
