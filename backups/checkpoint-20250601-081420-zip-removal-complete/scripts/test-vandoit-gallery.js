const puppeteer = require('puppeteer');

async function testVanDoItGallery() {
  let browser;
  try {
    console.log('🔍 Testing VanDoIt gallery functionality...');
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('VanDoIt') || msg.text().includes('gallery') || msg.text().includes('Gallery') || msg.text().includes('🔘')) {
        console.log('Browser:', msg.text());
      }
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for the app to load and builders to appear
    await page.waitForTimeout(5000);
    
    // Look for VanDoIt builder card specifically
    console.log('🔍 Looking for VanDoIt builder card...');
    
    // Wait for builder cards to load
    await page.waitForSelector('.MuiCard-root', { timeout: 10000 });
    
    // Find VanDoIt card by looking for the text content
    const vanDoItCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.MuiCard-root'));
      return cards.find(card => card.textContent.includes('VanDoIt'));
    });
    
    if (vanDoItCard.asElement()) {
      console.log('✅ Found VanDoIt card!');
      
      // Click on the VanDoIt card
      console.log('🖱️ Clicking on VanDoIt card...');
      await vanDoItCard.asElement().click();
      await page.waitForTimeout(2000);
      
      // Check if modal opened
      const modal = await page.$('.MuiDialog-root');
      if (modal) {
        console.log('✅ Modal opened successfully');
        
        // Look for tabs
        const tabs = await page.$$('.MuiTab-root');
        console.log(`Found ${tabs.length} tabs in modal`);
        
        if (tabs.length >= 2) {
          // Click on the Gallery tab (should be the second tab)
          console.log('🖱️ Clicking on Gallery tab...');
          await tabs[1].click();
          await page.waitForTimeout(2000);
          
          // Check for gallery images
          const galleryImages = await page.$$('img');
          console.log(`Found ${galleryImages.length} total images on page`);
          
          // Look specifically for gallery-related images
          const galleryContent = await page.evaluate(() => {
            // Look for images within the modal
            const modal = document.querySelector('.MuiDialog-root');
            if (modal) {
              const images = modal.querySelectorAll('img');
              return Array.from(images).map(img => ({
                src: img.src,
                alt: img.alt || 'no alt',
                width: img.width,
                height: img.height
              }));
            }
            return [];
          });
          
          console.log('🖼️ Gallery images in modal:');
          galleryContent.forEach((img, index) => {
            console.log(`  Image ${index + 1}:`);
            console.log(`    Source: ${img.src}`);
            console.log(`    Alt: ${img.alt}`);
            console.log(`    Dimensions: ${img.width}x${img.height}`);
          });
          
          if (galleryContent.length > 0) {
            console.log('✅ Gallery images found and displayed!');
          } else {
            console.log('❌ No gallery images found in modal');
            
            // Check if there's a "No gallery images available" message
            const noImagesText = await page.evaluate(() => {
              const modal = document.querySelector('.MuiDialog-root');
              return modal ? modal.textContent : '';
            });
            
            if (noImagesText.includes('No gallery images available')) {
              console.log('❌ "No gallery images available" message is showing');
            } else {
              console.log('📝 Modal content:', noImagesText.substring(0, 200) + '...');
            }
          }
        } else {
          console.log('❌ Gallery tab not found');
        }
      } else {
        console.log('❌ Modal did not open');
      }
    } else {
      console.log('❌ VanDoIt card not found');
      
      // Debug: List all available cards
      const cardTexts = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.MuiCard-root'));
        return cards.map(card => card.textContent.substring(0, 100));
      });
      
      console.log('📋 Available cards:');
      cardTexts.forEach((text, index) => {
        console.log(`  Card ${index + 1}: ${text}...`);
      });
    }
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testVanDoItGallery();
