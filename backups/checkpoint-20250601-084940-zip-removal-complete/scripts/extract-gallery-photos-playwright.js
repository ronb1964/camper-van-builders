#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

console.log('🎭 Gallery Photo Extraction using Playwright\n');

async function extractGalleryPhotos(builders) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  
  const results = {};
  
  for (const builder of builders) {
    console.log(`\n🔍 Extracting photos for: ${builder.name}`);
    console.log(`   Website: ${builder.website}`);
    
    try {
      const page = await context.newPage();
      
      // Set longer timeout for slow websites
      await page.goto(builder.website, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for page to fully load
      await page.waitForTimeout(3000);
      
      // Extract all images from the page
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        })).filter(img => 
          img.src && 
          img.src.startsWith('http') &&
          img.width > 200 && 
          img.height > 150 &&
          !img.src.includes('logo') &&
          !img.src.includes('icon') &&
          !img.alt.toLowerCase().includes('logo')
        );
      });
      
      // Look for gallery-specific selectors
      const galleryImages = await page.evaluate(() => {
        const gallerySelectors = [
          '.gallery img',
          '.portfolio img',
          '.builds img',
          '.work img',
          '.projects img',
          '[class*="gallery"] img',
          '[class*="portfolio"] img',
          '[id*="gallery"] img',
          '.van-gallery img',
          '.build-gallery img'
        ];
        
        const galleryImgs = [];
        gallerySelectors.forEach(selector => {
          const imgs = Array.from(document.querySelectorAll(selector));
          imgs.forEach(img => {
            if (img.src && img.src.startsWith('http')) {
              galleryImgs.push({
                src: img.src,
                alt: img.alt || '',
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
                selector: selector
              });
            }
          });
        });
        
        return galleryImgs;
      });
      
      // Combine and deduplicate images
      const allImages = [...images, ...galleryImages];
      const uniqueImages = allImages.filter((img, index, self) => 
        index === self.findIndex(i => i.src === img.src)
      );
      
      // Sort by size (larger images first) and take top 5
      const sortedImages = uniqueImages
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))
        .slice(0, 5);
      
      results[builder.id] = {
        name: builder.name,
        website: builder.website,
        photos: sortedImages.map(img => img.src),
        totalFound: uniqueImages.length,
        gallerySpecific: galleryImages.length
      };
      
      console.log(`   ✅ Found ${uniqueImages.length} images (${galleryImages.length} from gallery sections)`);
      console.log(`   📸 Selected top ${sortedImages.length} photos`);
      
      await page.close();
      
    } catch (error) {
      console.log(`   ❌ Error extracting from ${builder.name}: ${error.message}`);
      results[builder.id] = {
        name: builder.name,
        website: builder.website,
        photos: [],
        error: error.message
      };
    }
    
    // Small delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  await browser.close();
  return results;
}

async function main() {
  // This script can be called with builder data as argument
  // For now, create a test with Georgia builders
  const testBuilders = [
    {
      id: 94,
      name: "Summit Vans LLC",
      website: "https://thesummitvans.com/"
    },
    {
      id: 95,
      name: "Live More Campervans",
      website: "https://www.livemorecampervans.com/"
    },
    {
      id: 96,
      name: "Scamper RV Build & Design",
      website: "https://www.scamperrv.com/build"
    }
  ];
  
  console.log('🎭 Starting Playwright gallery extraction...');
  console.log(`📋 Processing ${testBuilders.length} builders\n`);
  
  try {
    const results = await extractGalleryPhotos(testBuilders);
    
    // Save results to JSON file
    const outputFile = path.join(__dirname, 'gallery-extraction-results.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Gallery extraction completed!');
    console.log(`💾 Results saved to: ${outputFile}`);
    
    // Summary
    console.log('\n📊 EXTRACTION SUMMARY:');
    Object.values(results).forEach(result => {
      if (result.error) {
        console.log(`   ❌ ${result.name}: Error - ${result.error}`);
      } else {
        console.log(`   ✅ ${result.name}: ${result.photos.length} photos (${result.totalFound} total found)`);
      }
    });
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { extractGalleryPhotos };

// Run if called directly
if (require.main === module) {
  main();
}
