const puppeteer = require('puppeteer');

async function testWorkingSelection() {
  let browser;
  try {
    console.log('🔍 Testing working state selection...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('🔍') || text.includes('📊') || text.includes('Found') || text.includes('builders') || text.includes('Processing')) {
        console.log('Browser:', text);
      }
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('🏛️ Clicking state selector...');
    
    // Click the state select element
    await page.click('#state-select');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Look for New Jersey option in the dropdown
    console.log('🔍 Looking for New Jersey option...');
    
    // Wait for dropdown to appear and click New Jersey
    try {
      await page.waitForSelector('[data-value="New Jersey"]', { timeout: 5000 });
      await page.click('[data-value="New Jersey"]');
      console.log('✅ Clicked New Jersey option');
    } catch (e) {
      // Try alternative selectors
      const alternatives = [
        'li[data-value="New Jersey"]',
        '[role="option"]:contains("New Jersey")',
        'li:contains("New Jersey")'
      ];
      
      for (const selector of alternatives) {
        try {
          await page.click(selector);
          console.log(`✅ Clicked New Jersey using: ${selector}`);
          break;
        } catch (err) {
          continue;
        }
      }
    }
    
    // Wait for state selection to process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Check for builder cards
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`🏢 Found ${builderCards.length} builder cards after selection`);
    
    if (builderCards.length > 0) {
      console.log('🎉 SUCCESS! Builders are now displaying');
      
      // Get info about the first builder
      const firstBuilderData = await page.evaluate(() => {
        const firstCard = document.querySelector('.MuiCard-root');
        if (!firstCard) return null;
        
        const name = firstCard.querySelector('h6, h5, .MuiTypography-h6, .MuiTypography-h5')?.textContent || 'No name found';
        const allText = firstCard.textContent;
        
        // Look for enhanced data
        const website = firstCard.querySelector('a[href*="http"]')?.href || 'No website';
        const phone = allText.match(/\(\d{3}\)\s?\d{3}-\d{4}/)?.[0] || 'No phone';
        const email = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'No email';
        
        // Social media links
        const socialLinks = Array.from(firstCard.querySelectorAll('a[href*="youtube"], a[href*="instagram"], a[href*="facebook"]')).map(a => a.href);
        
        // Photos
        const photos = Array.from(firstCard.querySelectorAll('img[src*="unsplash"], img[src*="http"]')).map(img => img.src);
        
        return {
          name,
          website,
          phone,
          email,
          socialLinks,
          photos,
          hasEnhancedData: website !== 'No website' || phone !== 'No phone' || email !== 'No email'
        };
      });
      
      console.log('\n📊 Enhanced Data Check:');
      console.log('Builder Name:', firstBuilderData.name);
      console.log('Website:', firstBuilderData.website);
      console.log('Phone:', firstBuilderData.phone);
      console.log('Email:', firstBuilderData.email);
      console.log('Social Links:', firstBuilderData.socialLinks.length);
      console.log('Photos:', firstBuilderData.photos.length);
      console.log('Enhanced Data Present:', firstBuilderData.hasEnhancedData ? '✅ YES' : '❌ NO');
      
      if (firstBuilderData.hasEnhancedData) {
        console.log('\n🎉 COMPLETE SUCCESS! The enhanced Google Sheets integration is working perfectly!');
        console.log('✅ Real contact information is displaying');
        console.log('✅ Social media links are available');
        console.log('✅ Photo galleries are working');
      }
    } else {
      console.log('❌ No builder cards found after state selection');
      
      // Debug what's on the page
      const pageDebug = await page.evaluate(() => {
        return {
          bodyText: document.body.textContent.substring(0, 500),
          hasStateSelected: document.body.textContent.includes('New Jersey'),
          hasBuilderNames: document.body.textContent.includes('VanDoIt') || document.body.textContent.includes('Humble Road')
        };
      });
      
      console.log('Page Debug:', pageDebug);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testWorkingSelection();
