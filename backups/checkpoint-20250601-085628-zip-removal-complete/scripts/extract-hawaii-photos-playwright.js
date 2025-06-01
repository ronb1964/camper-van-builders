#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

console.log('🌺 Hawaii Gallery Photo Extraction using Playwright\n');

async function extractHawaiiGalleryPhotos() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  
  const hawaiiBuilders = [
    {
      id: 97,
      name: "Hawaii Surf Campers",
      website: "https://www.hawaiisurfcampers.com/"
    },
    {
      id: 98,
      name: "Campervans Big Island",
      website: "https://www.campervansbigisland.com/"
    }
  ];
  
  const results = {};
  
  for (const builder of hawaiiBuilders) {
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
          !img.alt.toLowerCase().includes('logo') &&
          !img.src.includes('favicon')
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
          '.build-gallery img',
          '.camper img',
          '.van img',
          '.vehicle img'
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
      
      // Sort by size (larger images first) and take top 6
      const sortedImages = uniqueImages
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))
        .slice(0, 6);
      
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
  console.log('🌺 Starting Hawaii Playwright gallery extraction...');
  
  try {
    const results = await extractHawaiiGalleryPhotos();
    
    // Save results to JSON file
    const outputFile = path.join(__dirname, 'hawaii-gallery-extraction-results.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Hawaii gallery extraction completed!');
    console.log(`💾 Results saved to: ${outputFile}`);
    
    // Summary
    console.log('\n📊 HAWAII EXTRACTION SUMMARY:');
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

main();
