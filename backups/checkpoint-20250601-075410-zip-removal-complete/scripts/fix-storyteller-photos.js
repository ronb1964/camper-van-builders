const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractStorytellerPhotos() {
  console.log('🔍 Extracting better photos for Storyteller Overland...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Try multiple pages on their site
    const urlsToCheck = [
      'https://www.storytelleroverland.com',
      'https://www.storytelleroverland.com/vehicles',
      'https://www.storytelleroverland.com/gallery',
      'https://www.storytelleroverland.com/builds'
    ];
    
    let allImages = [];
    
    for (const url of urlsToCheck) {
      try {
        console.log(`Checking: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const images = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || '',
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            className: img.className || ''
          })).filter(img => 
            img.src && 
            img.src.startsWith('http') && 
            img.width > 500 && 
            img.height > 300 &&
            !img.src.toLowerCase().includes('logo') &&
            !img.src.toLowerCase().includes('icon') &&
            !img.src.toLowerCase().includes('favicon') &&
            !img.className.toLowerCase().includes('logo')
          );
        });
        
        console.log(`Found ${images.length} quality images on ${url}`);
        allImages.push(...images);
        
      } catch (error) {
        console.log(`Error checking ${url}: ${error.message}`);
      }
    }
    
    // Remove duplicates and get best quality images
    const uniqueImages = allImages.filter((img, index, self) => 
      index === self.findIndex(i => i.src === img.src)
    ).sort((a, b) => (b.width * b.height) - (a.width * a.height))
    .slice(0, 8); // Get top 8 images
    
    console.log(`\n✅ Found ${uniqueImages.length} high-quality images:`);
    uniqueImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.src}`);
      console.log(`   Size: ${img.width}x${img.height}`);
      console.log(`   Alt: ${img.alt}`);
      console.log('');
    });
    
    // Save results
    const output = {
      builder: 'Storyteller Overland',
      timestamp: new Date().toISOString(),
      totalFound: allImages.length,
      uniqueSelected: uniqueImages.length,
      images: uniqueImages
    };
    
    fs.writeFileSync('storyteller-overland-better-photos.json', JSON.stringify(output, null, 2));
    console.log('💾 Saved to storyteller-overland-better-photos.json');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

extractStorytellerPhotos().catch(console.error);
