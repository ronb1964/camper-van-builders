const puppeteer = require('puppeteer');

async function debugRenderingIssues() {
  let browser;
  try {
    console.log('🔍 Debugging rendering issues...');
    
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized', '--disable-web-security']
    });
    
    const page = await browser.newPage();
    
    // Capture all console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || type === 'warn') {
        console.log(`🚨 ${type.toUpperCase()}: ${text}`);
      } else if (text.includes('Error') || text.includes('Failed') || text.includes('❌')) {
        console.log(`⚠️ ISSUE: ${text}`);
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      console.log('💥 PAGE ERROR:', error.message);
    });
    
    // Capture failed requests
    page.on('requestfailed', request => {
      console.log('🌐 FAILED REQUEST:', request.url(), request.failure().errorText);
    });
    
    console.log('🌐 Loading app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(5000);
    
    // Check what's actually rendered
    console.log('\n📊 Analyzing page structure...');
    
    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        title: document.title,
        hasReactRoot: !!document.getElementById('root'),
        reactRootContent: document.getElementById('root')?.innerHTML?.length || 0,
        hasHeader: !!document.querySelector('header, .MuiAppBar-root'),
        hasMainContent: !!document.querySelector('main, .MuiContainer-root'),
        hasBuilderCards: document.querySelectorAll('.MuiCard-root').length,
        hasStateSelector: !!document.querySelector('[role="combobox"]'),
        hasErrorMessages: document.querySelectorAll('[class*="error"], .MuiAlert-root').length,
        visibleText: document.body.innerText.substring(0, 500),
        cssFiles: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href),
        jsFiles: Array.from(document.querySelectorAll('script[src]')).map(script => script.src),
        bodyClasses: document.body.className,
        hasLoadingSpinner: !!document.querySelector('.MuiCircularProgress-root'),
        errorElements: Array.from(document.querySelectorAll('[class*="error"], .MuiAlert-root')).map(el => el.textContent)
      };
      
      return analysis;
    });
    
    console.log('\n📋 Page Analysis Results:');
    console.log(`Title: ${pageAnalysis.title}`);
    console.log(`React Root: ${pageAnalysis.hasReactRoot ? '✅' : '❌'}`);
    console.log(`React Content Length: ${pageAnalysis.reactRootContent} characters`);
    console.log(`Header: ${pageAnalysis.hasHeader ? '✅' : '❌'}`);
    console.log(`Main Content: ${pageAnalysis.hasMainContent ? '✅' : '❌'}`);
    console.log(`Builder Cards: ${pageAnalysis.hasBuilderCards}`);
    console.log(`State Selector: ${pageAnalysis.hasStateSelector ? '✅' : '❌'}`);
    console.log(`Loading Spinner: ${pageAnalysis.hasLoadingSpinner ? '⏳' : '❌'}`);
    console.log(`Error Messages: ${pageAnalysis.hasErrorMessages}`);
    
    if (pageAnalysis.errorElements.length > 0) {
      console.log('\n🚨 Error Messages Found:');
      pageAnalysis.errorElements.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    console.log('\n📝 Visible Text Preview:');
    console.log(pageAnalysis.visibleText);
    
    console.log('\n🎨 CSS Files Loaded:');
    pageAnalysis.cssFiles.forEach(css => console.log(`  - ${css}`));
    
    console.log('\n📜 JS Files Loaded:');
    pageAnalysis.jsFiles.forEach(js => console.log(`  - ${js}`));
    
    // Check for specific React components
    const componentCheck = await page.evaluate(() => {
      return {
        appComponent: !!document.querySelector('[class*="App"]'),
        muiTheme: !!document.querySelector('[class*="MuiThemeProvider"], [class*="ThemeProvider"]'),
        materialUIComponents: document.querySelectorAll('[class*="Mui"]').length,
        stateSelector: document.querySelector('[role="combobox"]')?.textContent || 'Not found',
        tabs: document.querySelectorAll('.MuiTab-root').length,
        buttons: document.querySelectorAll('.MuiButton-root').length
      };
    });
    
    console.log('\n🔧 Component Analysis:');
    console.log(`App Component: ${componentCheck.appComponent ? '✅' : '❌'}`);
    console.log(`MUI Theme: ${componentCheck.muiTheme ? '✅' : '❌'}`);
    console.log(`Material-UI Components: ${componentCheck.materialUIComponents}`);
    console.log(`State Selector Text: "${componentCheck.stateSelector}"`);
    console.log(`Tabs: ${componentCheck.tabs}`);
    console.log(`Buttons: ${componentCheck.buttons}`);
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'rendering-debug.png', 
      fullPage: true 
    });
    console.log('Screenshot saved as rendering-debug.png');
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser staying open for manual inspection...');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugRenderingIssues();
