// Diagnostic script to check Google Maps API configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing Google Maps API Issues\n');

// Check .env file
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = envContent.match(/REACT_APP_GOOGLE_MAPS_API_KEY=(.+)/);
  
  if (apiKeyMatch) {
    const apiKey = apiKeyMatch[1].trim();
    console.log('✅ API Key found in .env file');
    console.log('🔑 Key prefix:', apiKey.substring(0, 10) + '...');
    console.log('📏 Key length:', apiKey.length, '(should be 39 characters)');
    
    // Check if key looks valid (starts with AIza)
    if (apiKey.startsWith('AIza')) {
      console.log('✅ API Key format looks correct');
    } else {
      console.log('❌ API Key format looks incorrect (should start with "AIza")');
    }
  } else {
    console.log('❌ REACT_APP_GOOGLE_MAPS_API_KEY not found in .env file');
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

console.log('\n📋 Common Google Maps API Issues:');
console.log('1. ❌ Maps JavaScript API not enabled in Google Cloud Console');
console.log('2. ❌ Billing not enabled for the Google Cloud project');
console.log('3. ❌ API key has domain/IP restrictions that block localhost');
console.log('4. ❌ API key has API restrictions that exclude Maps JavaScript API');
console.log('5. ❌ Quota exceeded (unlikely for development)');

console.log('\n🛠️ Troubleshooting Steps:');
console.log('1. Visit: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com');
console.log('2. Enable "Maps JavaScript API"');
console.log('3. Visit: https://console.cloud.google.com/billing');
console.log('4. Ensure billing is enabled');
console.log('5. Visit: https://console.cloud.google.com/apis/credentials');
console.log('6. Check API key restrictions (allow localhost:* for development)');

console.log('\n🧪 Test URLs:');
console.log('• Direct API test: http://localhost:3002/test-maps-js-api.html');
console.log('• Main app: http://localhost:3002');

console.log('\n💡 Quick Fix Options:');
console.log('1. Remove all API key restrictions temporarily');
console.log('2. Create a new unrestricted API key for development');
console.log('3. Add localhost:3002 to allowed referrers');
