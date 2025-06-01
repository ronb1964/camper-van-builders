// Debug what data the app is actually showing
const puppeteer = require('puppeteer');

async function debugAppData() {
  let browser;
  try {
    console.log('🔍 Starting browser to debug app data...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console logs from the page
    page.on('console', msg => {
      if (msg.text().includes('🔍') || msg.text().includes('📊') || msg.text().includes('✅') || msg.text().includes('❌')) {
        console.log('Browser Console:', msg.text());
      }
    });
    
    // Listen for network requests
    page.on('response', response => {
      if (response.url().includes('sheets.googleapis.com')) {
        console.log('📡 Google Sheets API call:', response.url());
        console.log('Status:', response.status());
      }
    });
    
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a bit for the app to load
    await page.waitForTimeout(5000);
    
    // Check if builders are loaded
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`🏢 Found ${builderCards.length} builder cards on the page`);
    
    // Get the first builder's data
    if (builderCards.length > 0) {
      const firstBuilderText = await page.evaluate(() => {
        const firstCard = document.querySelector('.MuiCard-root');
        return firstCard ? firstCard.textContent : 'No card found';
      });
      
      console.log('\n🏢 First builder card content:');
      console.log(firstBuilderText.substring(0, 500) + '...');
      
      // Check for social media icons
      const socialIcons = await page.$$('a[href*="youtube"], a[href*="instagram"], a[href*="facebook"]');
      console.log(`📱 Found ${socialIcons.length} social media icons`);
      
      // Check for photo gallery
      const photoGallery = await page.$('.photo-gallery, [data-testid="photo-gallery"]');
      console.log(`📸 Photo gallery found: ${photoGallery ? 'Yes' : 'No'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugAppData();
