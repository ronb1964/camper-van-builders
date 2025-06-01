const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractBuilderPhotos(url, builderName, maxPhotos = 8) {
  console.log(`\n🔍 Extracting photos from ${builderName}: ${url}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract all high-quality images
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        className: img.className || '',
        parentText: img.parentElement ? img.parentElement.textContent.substring(0, 100) : ''
      })).filter(img => 
        img.src && 
        img.src.startsWith('http') && 
        img.width > 300 && 
        img.height > 200 &&
        !img.src.toLowerCase().includes('logo') &&
        !img.src.toLowerCase().includes('icon') &&
        !img.src.toLowerCase().includes('favicon') &&
        !img.src.toLowerCase().includes('avatar') &&
        !img.className.toLowerCase().includes('logo') &&
        !img.className.toLowerCase().includes('icon')
      ).sort((a, b) => (b.width * b.height) - (a.width * a.height)); // Sort by size
    });
    
    // Try to find gallery or portfolio pages
    const galleryLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.filter(link => {
        const text = link.textContent.toLowerCase();
        const href = link.href.toLowerCase();
        return (
          text.includes('gallery') || 
          text.includes('portfolio') || 
          text.includes('builds') ||
          text.includes('projects') ||
          text.includes('work') ||
          href.includes('gallery') ||
          href.includes('portfolio') ||
          href.includes('builds') ||
          href.includes('projects')
        );
      }).map(link => ({
        url: link.href,
        text: link.textContent.trim()
      }));
    });
    
    console.log(`📸 Found ${images.length} potential images on main page`);
    console.log(`🔗 Found ${galleryLinks.length} potential gallery links`);
    
    let allImages = [...images];
    
    // Visit gallery pages to get more images
    for (const link of galleryLinks.slice(0, 3)) { // Limit to first 3 gallery pages
      try {
        console.log(`   Checking gallery: ${link.text} (${link.url})`);
        await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const galleryImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || '',
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            className: img.className || '',
            parentText: img.parentElement ? img.parentElement.textContent.substring(0, 100) : ''
          })).filter(img => 
            img.src && 
            img.src.startsWith('http') && 
            img.width > 300 && 
            img.height > 200 &&
            !img.src.toLowerCase().includes('logo') &&
            !img.src.toLowerCase().includes('icon') &&
            !img.src.toLowerCase().includes('favicon') &&
            !img.src.toLowerCase().includes('avatar') &&
            !img.className.toLowerCase().includes('logo') &&
            !img.className.toLowerCase().includes('icon')
          );
        });
        
        console.log(`     Found ${galleryImages.length} additional images`);
        allImages.push(...galleryImages);
        
      } catch (error) {
        console.log(`     Error accessing gallery: ${error.message}`);
      }
    }
    
    // Remove duplicates and limit to maxPhotos
    const uniqueImages = allImages.filter((img, index, self) => 
      index === self.findIndex(i => i.src === img.src)
    ).slice(0, maxPhotos);
    
    console.log(`✅ Final selection: ${uniqueImages.length} unique images for ${builderName}`);
    
    uniqueImages.forEach((img, index) => {
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
      totalFound: allImages.length,
      uniqueSelected: uniqueImages.length,
      galleryLinks: galleryLinks,
      images: uniqueImages
    };
    
    const filename = `${builderName.replace(/\s+/g, '-').toLowerCase()}-photos.json`;
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`💾 Saved to ${filename}`);
    
    return uniqueImages;
    
  } catch (error) {
    console.error(`❌ Error extracting images from ${builderName}:`, error.message);
    return [];
  } finally {
    await browser.close();
  }
}

// Alabama builders
const alabamaBuilders = [
  { name: 'Vulcan Coach', url: 'https://www.vulcancoach.com' },
  { name: 'Storyteller Overland', url: 'https://www.storytelleroverland.com' },
  { name: 'Gearbox Adventure Rentals', url: 'https://www.gearboxrentals.com' }
];

async function extractAlabamaPhotos() {
  console.log('🏁 Starting Alabama builder photo extraction...\n');
  
  for (const builder of alabamaBuilders) {
    await extractBuilderPhotos(builder.url, builder.name, 8);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between requests
  }
  
  console.log('\n🎉 Alabama photo extraction complete!');
}

// Run if called directly
if (require.main === module) {
  extractAlabamaPhotos().catch(console.error);
}

module.exports = { extractBuilderPhotos };
