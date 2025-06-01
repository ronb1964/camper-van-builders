#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('📸 Extracting gallery photos from Florida van builders...\n');

// Florida builders with their websites
const floridaBuilders = [
  {
    id: 89,
    name: "Woodpecker Crafts and Builds LLC",
    website: "https://woodpeckercraftsandbuilds.com/",
    galleryPages: [
      "https://woodpeckercraftsandbuilds.com/",
      "https://woodpeckercraftsandbuilds.com/steps-to-take-before-starting-you-custom-van-buildout/"
    ]
  },
  {
    id: 90,
    name: "Mango Vans",
    website: "https://www.mangovans.com/",
    galleryPages: [
      "https://www.mangovans.com/",
      "https://www.mangovans.com/process"
    ]
  },
  {
    id: 91,
    name: "Van Conversion Shop",
    website: "https://vanconversionshop.com/",
    galleryPages: [
      "https://vanconversionshop.com/",
      "https://vanconversionshop.com/custom-crafted-vans/"
    ]
  },
  {
    id: 92,
    name: "Our Van Quest",
    website: "https://www.ourvanquest.com/",
    galleryPages: [
      "https://www.ourvanquest.com/builds",
      "https://www.ourvanquest.com/gallery"
    ]
  },
  {
    id: 93,
    name: "Modern Times Van Co",
    website: "https://www.moderntimesvanco.com/",
    galleryPages: [
      "https://www.moderntimesvanco.com/",
      "https://www.moderntimesvanco.com/previous-conversions"
    ]
  }
];

async function extractPhotosFromBuilder(builder) {
  console.log(`🔍 Extracting photos for ${builder.name}...`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const allPhotos = new Set();
    
    for (const url of builder.galleryPages) {
      try {
        console.log(`   📄 Checking page: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Extract images from various selectors
        const images = await page.evaluate(() => {
          const imageSelectors = [
            'img[src*="van"]',
            'img[src*="conversion"]',
            'img[src*="build"]',
            'img[src*="interior"]',
            'img[src*="camper"]',
            'img[alt*="van"]',
            'img[alt*="conversion"]',
            'img[alt*="build"]',
            'img[alt*="interior"]',
            'img[alt*="camper"]',
            '.gallery img',
            '.portfolio img',
            '.project img',
            '.build img',
            '.conversion img'
          ];
          
          const foundImages = [];
          
          imageSelectors.forEach(selector => {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
              if (img.src && img.src.startsWith('http')) {
                const src = img.src;
                const alt = img.alt || img.title || '';
                
                // Filter for relevant images
                if (src.includes('van') || src.includes('conversion') || src.includes('build') || 
                    src.includes('interior') || src.includes('camper') || src.includes('project') ||
                    alt.toLowerCase().includes('van') || alt.toLowerCase().includes('conversion') ||
                    alt.toLowerCase().includes('build') || alt.toLowerCase().includes('interior') ||
                    alt.toLowerCase().includes('camper')) {
                  
                  // Exclude common non-gallery images
                  if (!src.includes('logo') && !src.includes('icon') && !src.includes('avatar') &&
                      !src.includes('profile') && !src.includes('social') && !src.includes('button') &&
                      img.width > 200 && img.height > 150) {
                    foundImages.push({
                      url: src,
                      alt: alt
                    });
                  }
                }
              }
            });
          });
          
          return foundImages;
        });
        
        images.forEach(img => {
          allPhotos.add(JSON.stringify(img));
        });
        
        console.log(`   ✅ Found ${images.length} images on this page`);
        
      } catch (pageError) {
        console.log(`   ⚠️  Error loading page ${url}: ${pageError.message}`);
      }
    }
    
    const uniquePhotos = Array.from(allPhotos).map(photo => JSON.parse(photo));
    console.log(`   📸 Total unique photos found: ${uniquePhotos.length}`);
    
    return uniquePhotos.slice(0, 8); // Limit to 8 photos per builder
    
  } catch (error) {
    console.error(`   ❌ Error extracting photos for ${builder.name}: ${error.message}`);
    return [];
  } finally {
    await browser.close();
  }
}

async function main() {
  const extractedPhotos = {};
  
  for (const builder of floridaBuilders) {
    try {
      const photos = await extractPhotosFromBuilder(builder);
      extractedPhotos[builder.id] = photos;
      
      if (photos.length > 0) {
        console.log(`✅ Successfully extracted ${photos.length} photos for ${builder.name}\n`);
      } else {
        console.log(`⚠️  No photos found for ${builder.name}\n`);
      }
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Failed to extract photos for ${builder.name}: ${error.message}\n`);
      extractedPhotos[builder.id] = [];
    }
  }
  
  // Save extracted photos to file
  const outputFile = path.join(__dirname, 'florida-extracted-photos.json');
  fs.writeFileSync(outputFile, JSON.stringify(extractedPhotos, null, 2));
  
  console.log('📊 EXTRACTION SUMMARY:');
  Object.entries(extractedPhotos).forEach(([builderId, photos]) => {
    const builder = floridaBuilders.find(b => b.id == builderId);
    console.log(`   ${builder.name}: ${photos.length} photos`);
  });
  
  console.log(`\n💾 Photos saved to: ${outputFile}`);
  console.log('\n✅ Photo extraction completed!');
}

main().catch(console.error);
