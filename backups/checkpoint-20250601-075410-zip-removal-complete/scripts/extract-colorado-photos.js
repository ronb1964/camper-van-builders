const puppeteer = require('puppeteer');
const fs = require('fs');

const coloradoBuilders = [
  {
    name: "The Vansmith",
    website: "https://thevansmith.com/",
    id: 20
  },
  {
    name: "Titan Vans", 
    website: "https://www.titanvans.com/",
    id: 21
  },
  {
    name: "Boulder Campervans",
    website: "https://www.bouldercampervans.com/",
    id: 22
  },
  {
    name: "Viking Van Customs",
    website: "https://vikingvancustoms.com/",
    id: 23
  },
  {
    name: "Flippin Vans",
    website: "https://www.flippinvans.com/",
    id: 24
  }
];

async function extractPhotosFromBuilder(page, builder) {
  try {
    console.log(`\n🔍 Extracting photos for ${builder.name}...`);
    console.log(`   📄 Loading: ${builder.website}`);
    
    await page.goto(builder.website, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    });
    
    // Wait a bit for dynamic content using setTimeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .map(img => {
          // Get the actual displayed size
          const rect = img.getBoundingClientRect();
          return {
            src: img.src,
            alt: img.alt || '',
            width: img.naturalWidth || rect.width,
            height: img.naturalHeight || rect.height,
            displayWidth: rect.width,
            displayHeight: rect.height
          };
        })
        .filter(img => {
          // Filter criteria
          const src = img.src.toLowerCase();
          const alt = img.alt.toLowerCase();
          
          // Must be reasonably sized
          if (img.width < 300 || img.height < 200) return false;
          if (img.displayWidth < 200 || img.displayHeight < 150) return false;
          
          // Skip obvious non-van images
          if (src.includes('logo') || src.includes('icon') || src.includes('favicon')) return false;
          if (alt.includes('logo') || alt.includes('icon')) return false;
          
          // Must be from the same domain or CDN
          const url = new URL(img.src);
          const websiteUrl = new URL(window.location.href);
          if (!url.hostname.includes(websiteUrl.hostname) && 
              !src.includes('wp-content') && 
              !src.includes('images') &&
              !src.includes('uploads')) {
            return false;
          }
          
          return true;
        })
        .slice(0, 8); // Limit to 8 images
    });
    
    console.log(`   ✅ Found ${images.length} potential images`);
    
    // Process and format for gallery
    const galleryImages = images.slice(0, 6).map((img, index) => ({
      url: img.src,
      alt: img.alt || `${builder.name} van conversion ${index + 1}`,
      caption: img.alt || `Custom van conversion by ${builder.name}`
    }));
    
    return galleryImages;
    
  } catch (error) {
    console.log(`   ❌ Error extracting from ${builder.name}:`, error.message);
    return [];
  }
}

async function extractAllColoradoPhotos() {
  console.log('🚀 Starting photo extraction for Colorado builders...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });
  
  const results = {};
  const imageDomains = new Set();
  
  for (const builder of coloradoBuilders) {
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const photos = await extractPhotosFromBuilder(page, builder);
    
    results[builder.name] = {
      id: builder.id,
      website: builder.website,
      photos: photos,
      photoCount: photos.length
    };
    
    // Collect domains for CSP update
    photos.forEach(photo => {
      try {
        const domain = new URL(photo.url).hostname;
        imageDomains.add(domain);
      } catch (e) {
        console.log(`   ⚠️  Invalid URL: ${photo.url}`);
      }
    });
    
    await page.close();
  }
  
  await browser.close();
  
  // Save results
  const outputFile = '/home/ron/Dev/Test/camper-van-builders/colorado-extracted-photos.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  
  console.log(`\n📁 Results saved to: ${outputFile}`);
  console.log('\n📊 EXTRACTION SUMMARY:');
  Object.entries(results).forEach(([name, data]) => {
    console.log(`   ${name}: ${data.photoCount} photos extracted`);
  });
  
  console.log('\n🌐 Image domains found:');
  Array.from(imageDomains).forEach(domain => {
    console.log(`   - ${domain}`);
  });
  
  return { results, imageDomains: Array.from(imageDomains) };
}

// Run the extraction
extractAllColoradoPhotos().catch(console.error);
