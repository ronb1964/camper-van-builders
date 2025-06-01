const puppeteer = require('puppeteer');

async function testGalleryInBrowser() {
  let browser;
  try {
    console.log('🔍 Testing gallery functionality in browser...');
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('🏠') || msg.text().includes('gallery') || msg.text().includes('Gallery')) {
        console.log('Browser:', msg.text());
      }
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Select New Jersey to see our target builders
    console.log('📍 Selecting New Jersey...');
    await page.click('div[role="combobox"]'); // Click the state selector
    await page.waitForTimeout(1000);
    
    // Look for New Jersey option
    const newJerseyOption = await page.waitForSelector('li[data-value="New Jersey"]', { timeout: 5000 });
    await newJerseyOption.click();
    await page.waitForTimeout(2000);
    
    // Look for builder cards
    console.log('🔍 Looking for builder cards...');
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`Found ${builderCards.length} builder cards`);
    
    if (builderCards.length > 0) {
      // Click on the first builder card to open the modal
      console.log('🖱️ Clicking on first builder card...');
      await builderCards[0].click();
      await page.waitForTimeout(2000);
      
      // Look for the modal
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
          await page.waitForTimeout(1000);
          
          // Check for gallery images
          const galleryImages = await page.$$('img[alt*="gallery"]');
          console.log(`Found ${galleryImages.length} gallery images`);
          
          if (galleryImages.length > 0) {
            console.log('✅ Gallery images found!');
            for (let i = 0; i < galleryImages.length; i++) {
              const src = await galleryImages[i].getAttribute('src');
              console.log(`  Image ${i + 1}: ${src}`);
            }
          } else {
            console.log('❌ No gallery images found');
            
            // Check if there's a "No gallery images available" message
            const noImagesMessage = await page.$('text="No gallery images available"');
            if (noImagesMessage) {
              console.log('❌ "No gallery images available" message is showing');
            }
          }
        } else {
          console.log('❌ Gallery tab not found');
        }
      } else {
        console.log('❌ Modal did not open');
      }
    } else {
      console.log('❌ No builder cards found');
    }
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser will stay open for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testGalleryInBrowser();
