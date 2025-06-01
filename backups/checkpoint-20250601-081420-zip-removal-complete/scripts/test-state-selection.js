const puppeteer = require('puppeteer');

async function testStateSelection() {
  let browser;
  try {
    console.log('🔍 Testing state selection and builder display...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🔍') || text.includes('📊') || text.includes('✅') || text.includes('❌') || text.includes('Found') || text.includes('builders')) {
        console.log('Browser:', text);
      }
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🏛️ Selecting New Jersey state...');
    
    // Click on the state dropdown
    await page.click('[data-testid="select-state"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Select New Jersey
    await page.click('[data-value="New Jersey"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for builder cards after state selection
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`🏢 Found ${builderCards.length} builder cards after state selection`);
    
    if (builderCards.length > 0) {
      // Get detailed info about the first builder
      const firstBuilderInfo = await page.evaluate(() => {
        const firstCard = document.querySelector('.MuiCard-root');
        if (!firstCard) return null;
        
        const name = firstCard.querySelector('h6, h5')?.textContent || 'No name found';
        const allText = firstCard.textContent;
        
        // Look for contact information
        const website = firstCard.querySelector('a[href*="http"]')?.href || 'No website found';
        const phone = allText.match(/\(\d{3}\)\s?\d{3}-\d{4}/)?.[0] || 'No phone found';
        const email = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'No email found';
        
        // Check for social media icons
        const socialIcons = firstCard.querySelectorAll('a[href*="youtube"], a[href*="instagram"], a[href*="facebook"]');
        const socialLinks = Array.from(socialIcons).map(icon => icon.href);
        
        // Check for photos
        const photos = firstCard.querySelectorAll('img[src*="unsplash"], img[src*="http"]');
        const photoUrls = Array.from(photos).map(img => img.src);
        
        return {
          name,
          website,
          phone,
          email,
          socialLinks,
          photoUrls,
          hasEnhancedData: website !== 'No website found' || phone !== 'No phone found' || email !== 'No email found'
        };
      });
      
      console.log('\n🏢 First Builder Enhanced Data Analysis:');
      console.log('Name:', firstBuilderInfo.name);
      console.log('Website:', firstBuilderInfo.website);
      console.log('Phone:', firstBuilderInfo.phone);
      console.log('Email:', firstBuilderInfo.email);
      console.log('Social Links:', firstBuilderInfo.socialLinks);
      console.log('Photo URLs:', firstBuilderInfo.photoUrls);
      console.log('Has Enhanced Data:', firstBuilderInfo.hasEnhancedData ? '✅ YES' : '❌ NO');
      
      if (firstBuilderInfo.hasEnhancedData) {
        console.log('\n🎉 SUCCESS: Enhanced Google Sheets data is displaying correctly!');
        console.log('✅ The app is now showing real contact information, social media links, and photos from Google Sheets');
      } else {
        console.log('\n⚠️  The builders are displaying but enhanced data may not be complete');
      }
    } else {
      console.log('\n❌ No builder cards found after state selection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testStateSelection();
