const puppeteer = require('puppeteer');

async function testEnhancedData() {
  let browser;
  try {
    console.log('🔍 Testing enhanced data in the app...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🔍') || text.includes('📊') || text.includes('✅') || text.includes('❌')) {
        console.log('Browser:', text);
      }
    });
    
    // Listen for network requests to Google Sheets
    page.on('response', response => {
      if (response.url().includes('sheets.googleapis.com')) {
        console.log('📡 Google Sheets API:', response.status(), response.url().substring(0, 100) + '...');
      }
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for builder cards
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`🏢 Found ${builderCards.length} builder cards`);
    
    if (builderCards.length > 0) {
      // Check first builder for enhanced data
      const firstBuilderData = await page.evaluate(() => {
        const firstCard = document.querySelector('.MuiCard-root');
        if (!firstCard) return null;
        
        const name = firstCard.querySelector('h6, h5')?.textContent || 'No name found';
        const website = firstCard.querySelector('a[href*="http"]')?.href || 'No website found';
        const phone = firstCard.textContent.match(/\(\d{3}\)\s?\d{3}-\d{4}/)?.[0] || 'No phone found';
        const email = firstCard.textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'No email found';
        
        // Check for social media icons
        const socialIcons = firstCard.querySelectorAll('a[href*="youtube"], a[href*="instagram"], a[href*="facebook"]');
        const socialLinks = Array.from(socialIcons).map(icon => icon.href);
        
        // Check for photo gallery
        const photos = firstCard.querySelectorAll('img');
        const photoCount = photos.length;
        
        return {
          name,
          website,
          phone,
          email,
          socialLinks,
          photoCount,
          hasEnhancedData: website !== 'No website found' && phone !== 'No phone found'
        };
      });
      
      console.log('\n🏢 First Builder Analysis:');
      console.log('Name:', firstBuilderData.name);
      console.log('Website:', firstBuilderData.website);
      console.log('Phone:', firstBuilderData.phone);
      console.log('Email:', firstBuilderData.email);
      console.log('Social Links:', firstBuilderData.socialLinks);
      console.log('Photo Count:', firstBuilderData.photoCount);
      console.log('Has Enhanced Data:', firstBuilderData.hasEnhancedData ? '✅ YES' : '❌ NO');
      
      if (firstBuilderData.hasEnhancedData) {
        console.log('\n🎉 SUCCESS: Enhanced data is displaying correctly!');
      } else {
        console.log('\n⚠️  WARNING: Enhanced data may not be displaying correctly');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testEnhancedData();
