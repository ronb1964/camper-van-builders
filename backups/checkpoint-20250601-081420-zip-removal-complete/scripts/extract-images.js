const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractImages(url, builderName) {
  console.log(`Extracting images from ${builderName}: ${url}`);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Extract all image URLs
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth,
        height: img.naturalHeight
      })).filter(img => 
        img.src && 
        img.src.startsWith('http') && 
        img.width > 200 && 
        img.height > 200 &&
        !img.src.includes('logo') &&
        !img.src.includes('icon')
      );
    });
    
    console.log(`Found ${images.length} potential gallery images for ${builderName}`);
    images.forEach((img, index) => {
      console.log(`${index + 1}. ${img.src}`);
      console.log(`   Alt: ${img.alt}`);
      console.log(`   Size: ${img.width}x${img.height}`);
      console.log('');
    });
    
    // Save to file
    const output = {
      builder: builderName,
      url: url,
      timestamp: new Date().toISOString(),
      images: images
    };
    
    fs.writeFileSync(`${builderName.replace(/\s+/g, '-').toLowerCase()}-images.json`, 
                     JSON.stringify(output, null, 2));
    
  } catch (error) {
    console.error(`Error extracting images from ${builderName}:`, error.message);
  } finally {
    await browser.close();
  }
}

// Builder URLs to extract from
const builders = [
  { name: 'Tommy Camper Vans', url: 'https://www.tommycampervans.com/van-gallery/' },
  { name: 'Action Van', url: 'https://www.actionvan.com/builds' },
  { name: 'Papago Vans', url: 'https://papagovans.com/recent-projects/' },
  { name: 'Backcountry Vans', url: 'https://backcountryvans.com/gallery/' },
  { name: 'Alaska Camper Van Conversions', url: 'https://www.alaskacampervanconversions.com/gallery' },
  { name: 'Boho Camper Vans', url: 'https://www.boho.life/gallery' }
];

async function extractAllBuilders() {
  for (const builder of builders) {
    await extractImages(builder.url, builder.name);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
  }
}

// Run if called directly
if (require.main === module) {
  extractAllBuilders().catch(console.error);
}

module.exports = { extractImages };
