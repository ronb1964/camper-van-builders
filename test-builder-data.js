const puppeteer = require('puppeteer');

async function testBuilderData() {
  let browser;
  try {
    console.log('🔍 Testing actual builder data structure...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Select New Jersey to trigger builder display
    await page.click('#state-select');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      await page.waitForSelector('[data-value="New Jersey"]', { timeout: 5000 });
      await page.click('[data-value="New Jersey"]');
    } catch (e) {
      // Try alternative approach
      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('li')).find(li => li.textContent === 'New Jersey');
        if (option) option.click();
      });
    }
    
    // Wait for builders to load
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Extract actual builder data from the first card
    const builderData = await page.evaluate(() => {
      // Find the first builder card
      const firstCard = document.querySelector('.MuiCard-root');
      if (!firstCard) return null;
      
      // Try to access the React component props/state
      const reactFiber = Object.keys(firstCard).find(key => key.startsWith('__reactFiber'));
      let builderProps = null;
      
      if (reactFiber) {
        const fiber = firstCard[reactFiber];
        // Navigate up the fiber tree to find the BuilderCard component
        let current = fiber;
        while (current && !builderProps) {
          if (current.memoizedProps && current.memoizedProps.builder) {
            builderProps = current.memoizedProps.builder;
            break;
          }
          current = current.return;
        }
      }
      
      // Also extract visible text content
      const visibleContent = {
        name: firstCard.querySelector('h6, h5, .MuiTypography-h6, .MuiTypography-h5')?.textContent,
        hasPhoneIcon: !!firstCard.querySelector('[href^="tel:"]'),
        hasEmailIcon: !!firstCard.querySelector('[href^="mailto:"]'),
        hasWebsiteIcon: !!firstCard.querySelector('[href^="http"]'),
        hasSocialIcons: firstCard.querySelectorAll('a[href*="youtube"], a[href*="instagram"], a[href*="facebook"]').length,
        allLinks: Array.from(firstCard.querySelectorAll('a')).map(a => ({ href: a.href, text: a.textContent }))
      };
      
      return {
        builderProps,
        visibleContent,
        cardHTML: firstCard.innerHTML.substring(0, 500) // First 500 chars of HTML
      };
    });
    
    console.log('\n📊 Builder Data Analysis:');
    
    if (builderData?.builderProps) {
      const builder = builderData.builderProps;
      console.log('✅ Found builder props:');
      console.log('Name:', builder.name);
      console.log('Phone:', builder.phone || 'EMPTY');
      console.log('Email:', builder.email || 'EMPTY');
      console.log('Website:', builder.website || 'EMPTY');
      console.log('Social Media:', builder.socialMedia || 'EMPTY');
      console.log('Gallery:', builder.gallery?.length || 0, 'photos');
    } else {
      console.log('❌ Could not extract builder props from React component');
    }
    
    console.log('\n👁️ Visible Content Analysis:');
    console.log('Name:', builderData?.visibleContent?.name);
    console.log('Phone Icon Present:', builderData?.visibleContent?.hasPhoneIcon ? '✅' : '❌');
    console.log('Email Icon Present:', builderData?.visibleContent?.hasEmailIcon ? '✅' : '❌');
    console.log('Website Icon Present:', builderData?.visibleContent?.hasWebsiteIcon ? '✅' : '❌');
    console.log('Social Icons Count:', builderData?.visibleContent?.hasSocialIcons || 0);
    console.log('All Links:', builderData?.visibleContent?.allLinks);
    
    console.log('\n🔍 Card HTML Sample:');
    console.log(builderData?.cardHTML);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testBuilderData();
