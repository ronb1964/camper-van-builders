const puppeteer = require('puppeteer');

async function debugAppState() {
  let browser;
  try {
    console.log('🔍 Debugging app state...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for all console logs
    page.on('console', msg => {
      console.log('Browser:', msg.text());
    });
    
    // Listen for errors
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get app state
    const appState = await page.evaluate(() => {
      // Check if React is loaded
      const reactRoot = document.getElementById('root');
      const hasReactContent = reactRoot && reactRoot.innerHTML.length > 100;
      
      // Check for any error messages
      const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
      const errors = Array.from(errorElements).map(el => el.textContent);
      
      // Check for loading states
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"]');
      const isLoading = loadingElements.length > 0;
      
      // Check for builder-related elements
      const builderElements = document.querySelectorAll('[class*="builder"], [class*="Builder"], .MuiCard-root');
      
      // Get page title and main content
      const title = document.title;
      const bodyText = document.body.textContent.substring(0, 500);
      
      return {
        hasReactContent,
        errors,
        isLoading,
        builderElementCount: builderElements.length,
        title,
        bodyText,
        url: window.location.href
      };
    });
    
    console.log('\n📊 App State Analysis:');
    console.log('URL:', appState.url);
    console.log('Title:', appState.title);
    console.log('Has React Content:', appState.hasReactContent ? '✅' : '❌');
    console.log('Is Loading:', appState.isLoading ? '⏳' : '✅');
    console.log('Builder Elements Found:', appState.builderElementCount);
    console.log('Errors:', appState.errors.length > 0 ? appState.errors : 'None');
    console.log('\nPage Content Preview:');
    console.log(appState.bodyText);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugAppState();
