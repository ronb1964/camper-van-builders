const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractArizonaPhotos() {
  console.log('🌵 Extracting authentic photos for Arizona builders...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Arizona builders to extract photos for
  const arizonaBuilders = [
    {
      name: 'Tommy Camper Vans',
      website: 'https://www.tommycampervans.com',
      specialties: ['Mercedes-Benz Certified', 'Custom Layouts', 'Superior Craftsmanship'],
      targetPhotos: 8
    },
    {
      name: 'Boho Camper Vans', 
      website: 'https://www.boho.life',
      specialties: ['Shark Tank Featured', 'Boho Aesthetic', 'Custom Layouts'],
      targetPhotos: 8
    },
    {
      name: 'Action Van',
      website: 'https://www.actionvan.com',
      specialties: ['Outdoor Lifestyle', 'Custom Storage', 'Mobile Office'],
      targetPhotos: 8
    },
    {
      name: 'Papago Vans',
      website: 'https://papagovans.com', 
      specialties: ['RVIA Certified', 'Luxury Builds', 'Adventure-Ready'],
      targetPhotos: 8
    }
  ];
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    for (const builder of arizonaBuilders) {
      console.log(`\n🔍 Extracting photos for: ${builder.name}`);
      console.log(`Website: ${builder.website}`);
      console.log(`Specialties: ${builder.specialties.join(', ')}`);
      
      // URLs to check for each builder
      const urlsToCheck = [
        builder.website,
        `${builder.website}/gallery`,
        `${builder.website}/portfolio`, 
        `${builder.website}/builds`,
        `${builder.website}/projects`,
        `${builder.website}/work`,
        `${builder.website}/conversions`,
        `${builder.website}/vans`,
        `${builder.website}/completed-builds`,
        `${builder.website}/our-work`,
        `${builder.website}/showcase`,
        `${builder.website}/photos`
      ];
      
      let allImages = [];
      
      for (const url of urlsToCheck) {
        try {
          console.log(`  Checking: ${url}`);
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Scroll to load lazy images
          await page.evaluate(() => {
            return new Promise((resolve) => {
              let totalHeight = 0;
              const distance = 100;
              const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
                }
              }, 100);
            });
          });
          
          const images = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            return imgs.map(img => ({
              src: img.src,
              alt: img.alt || '',
              title: img.title || '',
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
              className: img.className || '',
              parentText: img.parentElement ? img.parentElement.textContent.slice(0, 100) : '',
              dataSrc: img.getAttribute('data-src') || '',
              srcset: img.srcset || ''
            })).filter(img => {
              const src = img.src || img.dataSrc;
              return src && 
                src.startsWith('http') && 
                img.width > 500 && 
                img.height > 300 &&
                !src.toLowerCase().includes('logo') &&
                !src.toLowerCase().includes('icon') &&
                !src.toLowerCase().includes('favicon') &&
                !src.toLowerCase().includes('avatar') &&
                !src.toLowerCase().includes('profile') &&
                !src.toLowerCase().includes('header') &&
                !src.toLowerCase().includes('footer') &&
                !img.className.toLowerCase().includes('logo') &&
                !img.className.toLowerCase().includes('icon') &&
                !img.className.toLowerCase().includes('nav') &&
                // Filter out common stock photo patterns
                !src.includes('unsplash') &&
                !src.includes('pexels') &&
                !src.includes('shutterstock') &&
                !src.includes('pixabay') &&
                // Look for van/camper related content
                (src.toLowerCase().includes('van') ||
                 src.toLowerCase().includes('camper') ||
                 src.toLowerCase().includes('build') ||
                 src.toLowerCase().includes('conversion') ||
                 img.alt.toLowerCase().includes('van') ||
                 img.alt.toLowerCase().includes('camper') ||
                 img.alt.toLowerCase().includes('build') ||
                 img.parentText.toLowerCase().includes('van') ||
                 img.parentText.toLowerCase().includes('camper') ||
                 img.width * img.height > 400000) // Large images likely to be gallery photos
            });
          });
          
          console.log(`    Found ${images.length} quality van/camper images`);
          allImages.push(...images);
          
        } catch (error) {
          console.log(`    Error checking ${url}: ${error.message}`);
        }
      }
      
      // Remove duplicates and get best quality images
      const uniqueImages = allImages.filter((img, index, self) => {
        const src = img.src || img.dataSrc;
        return index === self.findIndex(i => (i.src || i.dataSrc) === src);
      }).sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .slice(0, builder.targetPhotos);
      
      console.log(`\n✅ Found ${uniqueImages.length} high-quality images for ${builder.name}:`);
      uniqueImages.forEach((img, index) => {
        const src = img.src || img.dataSrc;
        console.log(`${index + 1}. ${src}`);
        console.log(`   Size: ${img.width}x${img.height}`);
        console.log(`   Alt: ${img.alt}`);
        console.log(`   Context: ${img.parentText.slice(0, 50)}...`);
        console.log('');
      });
      
      // Save results for each builder
      const output = {
        builder: builder.name,
        website: builder.website,
        specialties: builder.specialties,
        timestamp: new Date().toISOString(),
        targetPhotos: builder.targetPhotos,
        totalFound: allImages.length,
        uniqueSelected: uniqueImages.length,
        images: uniqueImages
      };
      
      const filename = `${builder.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-photos.json`;
      fs.writeFileSync(filename, JSON.stringify(output, null, 2));
      console.log(`💾 Saved to ${filename}`);
    }
    
    console.log('\n🎉 Arizona photo extraction complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

extractArizonaPhotos().catch(console.error);
