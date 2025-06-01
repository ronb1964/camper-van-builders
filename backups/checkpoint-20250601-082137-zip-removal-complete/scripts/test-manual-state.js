const puppeteer = require('puppeteer');

async function testManualState() {
  let browser;
  try {
    console.log('🔍 Testing manual state selection...');
    
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔍 Looking for state selection elements...');
    
    // Try to find and click the state selector
    const stateSelectors = [
      '#state-select',
      '[aria-label*="State"]',
      '[placeholder*="State"]',
      'input[name="state"]',
      '.MuiSelect-root',
      '.MuiAutocomplete-root input'
    ];
    
    let stateElement = null;
    for (const selector of stateSelectors) {
      try {
        stateElement = await page.$(selector);
        if (stateElement) {
          console.log(`✅ Found state selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (stateElement) {
      console.log('🏛️ Attempting to select New Jersey...');
      
      // Try clicking the element
      await stateElement.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try typing "New Jersey"
      await page.type(stateSelectors[stateSelectors.length - 1], 'New Jersey');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try pressing Enter
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } else {
      console.log('❌ Could not find state selector, trying direct function call...');
      
      // Directly call the state selection function
      await page.evaluate(() => {
        // Try to find and trigger state selection directly
        if (window.handleStateSelect) {
          window.handleStateSelect('New Jersey');
        }
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Check for builder cards
    const builderCards = await page.$$('.MuiCard-root');
    console.log(`🏢 Found ${builderCards.length} builder cards`);
    
    // Also check for any elements that might contain builder information
    const builderElements = await page.$$('[class*="builder"], [class*="Builder"]');
    console.log(`🏗️ Found ${builderElements.length} builder-related elements`);
    
    // Get page content to see what's actually displayed
    const pageContent = await page.evaluate(() => {
      return {
        hasCards: document.querySelectorAll('.MuiCard-root').length,
        hasBuilderText: document.body.textContent.includes('VanDoIt') || document.body.textContent.includes('Humble Road'),
        bodyTextSample: document.body.textContent.substring(0, 1000)
      };
    });
    
    console.log('\n📄 Page Content Analysis:');
    console.log('Cards found:', pageContent.hasCards);
    console.log('Has builder names:', pageContent.hasBuilderText);
    console.log('Body text sample:', pageContent.bodyTextSample);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testManualState();
