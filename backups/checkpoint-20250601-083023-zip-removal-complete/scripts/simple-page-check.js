const puppeteer = require('puppeteer');

async function simplePageCheck() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Collect errors
    const errors = [];
    page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });
    
    page.on('requestfailed', request => {
      errors.push(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
    });
    
    console.log('Loading page...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for React to potentially render
    await page.waitForTimeout(3000);
    
    // Get basic page info
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 200),
        hasReactRoot: !!document.getElementById('root'),
        reactContent: document.getElementById('root')?.innerHTML?.length || 0,
        errorCount: document.querySelectorAll('[class*="error"]').length,
        loadingSpinners: document.querySelectorAll('.MuiCircularProgress-root').length,
        builderCards: document.querySelectorAll('.MuiCard-root').length,
        muiComponents: document.querySelectorAll('[class*="Mui"]').length
      };
    });
    
    console.log('\n=== PAGE ANALYSIS ===');
    console.log(`Title: ${pageInfo.title}`);
    console.log(`React Root: ${pageInfo.hasReactRoot}`);
    console.log(`React Content Size: ${pageInfo.reactContent} chars`);
    console.log(`Builder Cards: ${pageInfo.builderCards}`);
    console.log(`MUI Components: ${pageInfo.muiComponents}`);
    console.log(`Loading Spinners: ${pageInfo.loadingSpinners}`);
    console.log(`Error Elements: ${pageInfo.errorCount}`);
    
    console.log('\n=== VISIBLE TEXT ===');
    console.log(pageInfo.bodyText);
    
    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(error => console.log(error));
    }
    
    console.log('\n=== CONSOLE MESSAGES (last 10) ===');
    consoleMessages.slice(-10).forEach(msg => console.log(msg));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simplePageCheck();
