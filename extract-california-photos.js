const puppeteer = require('puppeteer');
const fs = require('fs');

const californiaBuilders = [
  {
    name: 'Cano Conversions',
    website: 'https://canoconversions.com/',
    galleryUrls: [
      'https://canoconversions.com/',
      'https://canoconversions.com/work/',
      'https://canoconversions.com/about/'
    ]
  },
  {
    name: 'El Kapitan',
    website: 'https://elkapitan.com/',
    galleryUrls: [
      'https://elkapitan.com/',
      'https://elkapitan.com/van-gallery/',
      'https://elkapitan.com/rv-models/',
      'https://elkapitan.com/rv-models/sprinter-144-story-maker/',
      'https://elkapitan.com/rv-models/sprinter-170-dream-weaver/'
    ]
  },
  {
    name: 'Exclusive Outfitters',
    website: 'https://www.exclusiveoutfitters.com/',
    galleryUrls: [
      'https://www.exclusiveoutfitters.com/',
      'https://www.exclusiveoutfitters.com/products/model-a',
      'https://www.exclusiveoutfitters.com/products/model-b',
      'https://www.exclusiveoutfitters.com/products/model-c',
      'https://www.exclusiveoutfitters.com/products/model-d',
      'https://www.exclusiveoutfitters.com/products/model-e'
    ]
  },
  {
    name: 'So-Cal Van Conversion',
    website: 'https://so-calvans.com/',
    galleryUrls: [
      'https://so-calvans.com/',
      'https://so-calvans.com/gallery',
      'https://so-calvans.com/builds'
    ]
  },
  {
    name: 'Vanspeed Shop',
    website: 'https://www.vanspeedshop.com/',
    galleryUrls: [
      'https://www.vanspeedshop.com/',
      'https://www.vanspeedshop.com/gallery',
      'https://www.vanspeedshop.com/builds',
      'https://www.vanspeedshop.com/conversions'
    ]
  },
  {
    name: 'Camplife Customs',
    website: 'https://camplifecustoms.com/',
    galleryUrls: [
      'https://camplifecustoms.com/',
      'https://camplifecustoms.com/sprinter-conversions/',
      'https://camplifecustoms.com/promaster-conversions/',
      'https://camplifecustoms.com/miscellaneous-builds/',
      'https://camplifecustoms.com/apres/',
      'https://camplifecustoms.com/builds',
      'https://camplifecustoms.com/gallery'
    ]
  },
  {
    name: 'Bossi Vans',
    website: 'https://www.bossivans.com/',
    galleryUrls: [
      'https://www.bossivans.com/',
      'https://www.bossivans.com/builds',
      'https://www.bossivans.com/goliath',
      'https://www.bossivans.com/gallery',
      'https://www.bossivans.com/portfolio'
    ]
  },
  {
    name: 'El Kapitan',
    website: 'https://elkapitan.com/',
    galleryUrls: [
      'https://elkapitan.com/',
      'https://elkapitan.com/gallery',
      'https://elkapitan.com/builds',
      'https://elkapitan.com/portfolio',
      'https://elkapitan.com/conversions'
    ]
  },
  {
    name: 'Outpost Vans',
    website: 'https://www.outpostvans.com/',
    galleryUrls: [
      'https://www.outpostvans.com/',
      'https://www.outpostvans.com/gallery',
      'https://www.outpostvans.com/builds',
      'https://www.outpostvans.com/conversions',
      'https://www.outpostvans.com/portfolio'
    ]
  }
];

async function extractPhotosForBuilder(page, builder) {
  console.log(`\n🔍 Extracting photos for ${builder.name}...`);
  const allImages = new Set();
  
  for (const url of builder.galleryUrls) {
    try {
      console.log(`  📄 Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Extract all images from the page
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0,
          className: img.className || '',
          id: img.id || ''
        })).filter(img => {
          // Filter out small images, logos, icons
          const minSize = 300;
          const isLargeEnough = img.width >= minSize && img.height >= minSize;
          
          // Filter out common logo/icon patterns
          const isNotLogo = !img.src.toLowerCase().includes('logo') &&
                           !img.src.toLowerCase().includes('icon') &&
                           !img.alt.toLowerCase().includes('logo') &&
                           !img.alt.toLowerCase().includes('icon') &&
                           !img.className.toLowerCase().includes('logo') &&
                           !img.className.toLowerCase().includes('icon');
          
          // Must have valid src
          const hasValidSrc = img.src && img.src.startsWith('http');
          
          return isLargeEnough && isNotLogo && hasValidSrc;
        });
      });
      
      images.forEach(img => {
        if (img.src) {
          allImages.add(JSON.stringify(img));
        }
      });
      
      console.log(`    ✅ Found ${images.length} potential images`);
      
    } catch (error) {
      console.log(`    ❌ Error visiting ${url}: ${error.message}`);
    }
  }
  
  // Convert back to objects and remove duplicates
  const uniqueImages = Array.from(allImages).map(imgStr => JSON.parse(imgStr));
  
  // Sort by size (largest first) and take top images
  const sortedImages = uniqueImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  
  console.log(`  📊 Total unique images found: ${sortedImages.length}`);
  
  return sortedImages.slice(0, 10); // Take top 10 images
}

async function main() {
  console.log('🚀 Starting California builders photo extraction...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    for (const builder of californiaBuilders) {
      const images = await extractPhotosForBuilder(page, builder);
      
      // Save results to individual files
      const filename = `california-${builder.name.toLowerCase().replace(/\s+/g, '-')}-photos.json`;
      fs.writeFileSync(filename, JSON.stringify({
        builder: builder.name,
        website: builder.website,
        extractedAt: new Date().toISOString(),
        totalImages: images.length,
        images: images
      }, null, 2));
      
      console.log(`  💾 Saved results to ${filename}`);
    }
    
  } catch (error) {
    console.error('❌ Error during extraction:', error);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ California photo extraction complete!');
}

main().catch(console.error);
