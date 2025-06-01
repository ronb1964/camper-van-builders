const https = require('https');
const http = require('http');

function checkPageContent() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    }
  };

  console.log('🔍 Checking page content...');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📊 Content Length: ${data.length} characters`);
      
      // Check for React content
      const hasReactRoot = data.includes('id="root"');
      const hasReactScripts = data.includes('react-scripts');
      const hasTitle = data.includes('Camper Van Builders');
      
      console.log(`✅ Has React Root: ${hasReactRoot}`);
      console.log(`✅ Has React Scripts: ${hasReactScripts}`);
      console.log(`✅ Has Title: ${hasTitle}`);
      
      // Extract the body content between <body> tags
      const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        const bodyContent = bodyMatch[1];
        console.log('\n📝 Body Content Preview:');
        console.log(bodyContent.substring(0, 500) + '...');
        
        // Check for specific elements
        const hasNoscript = bodyContent.includes('You need to enable JavaScript');
        const hasRootDiv = bodyContent.includes('<div id="root">');
        const hasScripts = bodyContent.includes('<script');
        
        console.log(`\n🔧 Element Check:`);
        console.log(`- Noscript message: ${hasNoscript}`);
        console.log(`- Root div: ${hasRootDiv}`);
        console.log(`- Scripts: ${hasScripts}`);
        
        // Look for any inline content in the root div
        const rootMatch = bodyContent.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);
        if (rootMatch) {
          const rootContent = rootMatch[1].trim();
          console.log(`\n📦 Root Div Content: "${rootContent}"`);
          if (rootContent.length === 0) {
            console.log('⚠️ Root div is empty - React may not be rendering');
          }
        }
      }
      
      // Check for error indicators
      const hasErrors = data.toLowerCase().includes('error') || 
                       data.toLowerCase().includes('failed') ||
                       data.toLowerCase().includes('cannot');
      
      if (hasErrors) {
        console.log('\n🚨 Potential errors found in HTML');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Request timeout');
    req.destroy();
  });

  req.end();
}

checkPageContent();
