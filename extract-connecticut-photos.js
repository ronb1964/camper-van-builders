const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractPhotosFromBuilder(builderName, website) {
  console.log(`\n🔍 Extracting photos from ${builderName}...`);
  console.log(`   Website: ${website}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set a reasonable timeout
    await page.setDefaultTimeout(30000);
    
    console.log(`   📄 Loading homepage...`);
    await page.goto(website, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a bit for any lazy-loaded images
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract images from the page
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
        !img.src.includes('avatar') &&
        (img.alt.toLowerCase().includes('van') || 
         img.alt.toLowerCase().includes('conversion') ||
         img.alt.toLowerCase().includes('build') ||
         img.alt.toLowerCase().includes('camper') ||
         img.src.includes('van') ||
         img.src.includes('conversion') ||
         img.src.includes('build') ||
         img.src.includes('camper') ||
         img.width > 400) // Include larger images that might be van photos
      );
    });
    
    console.log(`   📸 Found ${images.length} potential van images on homepage`);
    
    // Try to find gallery or portfolio pages
    const galleryLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(link => ({
        href: link.href,
        text: link.textContent.toLowerCase().trim()
      })).filter(link => 
        link.href &&
        (link.text.includes('gallery') ||
         link.text.includes('portfolio') ||
         link.text.includes('builds') ||
         link.text.includes('van builds') ||
         link.text.includes('our work') ||
         link.text.includes('examples'))
      );
    });
    
    console.log(`   🔗 Found ${galleryLinks.length} potential gallery links`);
    
    let allImages = [...images];
    
    // Visit gallery pages to get more photos
    for (const link of galleryLinks.slice(0, 3)) { // Limit to 3 gallery pages
      try {
        console.log(`   📄 Checking gallery page: ${link.text}`);
        await page.goto(link.href, { waitUntil: 'networkidle0', timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const galleryImages = await page.evaluate(() => {
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
            !img.src.includes('avatar')
          );
        });
        
        console.log(`   📸 Found ${galleryImages.length} images on gallery page`);
        allImages = allImages.concat(galleryImages);
      } catch (error) {
        console.log(`   ⚠️  Could not load gallery page: ${link.text}`);
      }
    }
    
    // Remove duplicates and select best images
    const uniqueImages = allImages.filter((img, index, self) => 
      index === self.findIndex(i => i.src === img.src)
    );
    
    // Sort by size (larger images first) and take up to 8
    const selectedImages = uniqueImages
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .slice(0, 8)
      .map(img => img.src);
    
    console.log(`   ✅ Selected ${selectedImages.length} photos for gallery`);
    selectedImages.forEach((url, index) => {
      console.log(`      ${index + 1}. ${url}`);
    });
    
    return selectedImages;
    
  } catch (error) {
    console.log(`   ❌ Error extracting photos: ${error.message}`);
    return [];
  } finally {
    await browser.close();
  }
}

async function extractConnecticutPhotos() {
  console.log('🎯 Starting Connecticut photo extraction...');
  
  const connecticutBuilders = [
    {
      name: "Live a Little Vans",
      website: "https://www.livealittlevans.com/"
    }
  ];
  
  const results = {};
  
  for (const builder of connecticutBuilders) {
    try {
      const photos = await extractPhotosFromBuilder(builder.name, builder.website);
      results[builder.name] = photos;
    } catch (error) {
      console.log(`❌ Failed to extract photos for ${builder.name}: ${error.message}`);
      results[builder.name] = [];
    }
  }
  
  // Save results to file
  fs.writeFileSync('connecticut-extracted-photos.json', JSON.stringify(results, null, 2));
  
  console.log('\n📊 Connecticut Photo Extraction Summary:');
  for (const [builderName, photos] of Object.entries(results)) {
    console.log(`   ${builderName}: ${photos.length} photos`);
  }
  
  console.log('\n✅ Photo extraction completed!');
  console.log('📁 Results saved to: connecticut-extracted-photos.json');
  
  return results;
}

// Run the extraction
extractConnecticutPhotos().catch(console.error);
