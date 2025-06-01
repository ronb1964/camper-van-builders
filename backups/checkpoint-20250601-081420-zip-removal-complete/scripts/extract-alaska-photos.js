const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAlaskaPhotos() {
  console.log('🏔️ Extracting authentic photos for Alaska builders...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Alaska builders to extract photos for
  const alaskaBuilders = [
    {
      name: 'Alaska Camper Van Conversions',
      website: 'https://www.alaskacampervanconversions.com',
      currentPhotos: 3, // Already has some photos
      targetPhotos: 8
    },
    {
      name: 'Vanquest Alaska', 
      website: 'https://vanquestak.com',
      currentPhotos: 1, // Already has 1 photo
      targetPhotos: 8
    },
    {
      name: 'Backcountry Vans',
      website: 'https://backcountryvans.com', 
      currentPhotos: 0, // Empty gallery
      targetPhotos: 8
    }
  ];
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    for (const builder of alaskaBuilders) {
      console.log(`\n🔍 Extracting photos for: ${builder.name}`);
      console.log(`Website: ${builder.website}`);
      console.log(`Current photos: ${builder.currentPhotos}, Target: ${builder.targetPhotos}`);
      
      // URLs to check for each builder
      const urlsToCheck = [
        builder.website,
        `${builder.website}/gallery`,
        `${builder.website}/portfolio`, 
        `${builder.website}/builds`,
        `${builder.website}/projects`,
        `${builder.website}/work`,
        `${builder.website}/conversions`,
        `${builder.website}/vans`
      ];
      
      let allImages = [];
      
      for (const url of urlsToCheck) {
        try {
          console.log(`  Checking: ${url}`);
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
              className: img.className || '',
              parentText: img.parentElement ? img.parentElement.textContent.slice(0, 100) : ''
            })).filter(img => 
              img.src && 
              img.src.startsWith('http') && 
              img.width > 400 && 
              img.height > 300 &&
              !img.src.toLowerCase().includes('logo') &&
              !img.src.toLowerCase().includes('icon') &&
              !img.src.toLowerCase().includes('favicon') &&
              !img.src.toLowerCase().includes('avatar') &&
              !img.src.toLowerCase().includes('profile') &&
              !img.className.toLowerCase().includes('logo') &&
              !img.className.toLowerCase().includes('icon') &&
              // Filter out common stock photo patterns
              !img.src.includes('unsplash') &&
              !img.src.includes('pexels') &&
              !img.src.includes('shutterstock')
            );
          });
          
          console.log(`    Found ${images.length} quality images`);
          allImages.push(...images);
          
        } catch (error) {
          console.log(`    Error checking ${url}: ${error.message}`);
        }
      }
      
      // Remove duplicates and get best quality images
      const uniqueImages = allImages.filter((img, index, self) => 
        index === self.findIndex(i => i.src === img.src)
      ).sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .slice(0, builder.targetPhotos);
      
      console.log(`\n✅ Found ${uniqueImages.length} high-quality images for ${builder.name}:`);
      uniqueImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.src}`);
        console.log(`   Size: ${img.width}x${img.height}`);
        console.log(`   Alt: ${img.alt}`);
        console.log(`   Context: ${img.parentText.slice(0, 50)}...`);
        console.log('');
      });
      
      // Save results for each builder
      const output = {
        builder: builder.name,
        website: builder.website,
        timestamp: new Date().toISOString(),
        currentPhotos: builder.currentPhotos,
        targetPhotos: builder.targetPhotos,
        totalFound: allImages.length,
        uniqueSelected: uniqueImages.length,
        images: uniqueImages
      };
      
      const filename = `${builder.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-photos.json`;
      fs.writeFileSync(filename, JSON.stringify(output, null, 2));
      console.log(`💾 Saved to ${filename}`);
    }
    
    console.log('\n🎉 Alaska photo extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

extractAlaskaPhotos().catch(console.error);
