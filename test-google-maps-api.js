// Test script to verify Google Maps API key is working
const https = require('https');

const API_KEY = 'AIzaSyAoQ4yurBebsXBTRoEA2grN_Zy_tM6j-1U';

// Test the API key with a simple geocoding request
const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Birmingham,AL&key=${API_KEY}`;

console.log('🧪 Testing Google Maps API key...');
console.log('API Key:', API_KEY.substring(0, 10) + '...');

https.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📍 API Response Status:', response.status);
      
      if (response.status === 'OK') {
        console.log('✅ Google Maps API key is working correctly!');
        console.log('📍 Test location (Birmingham, AL):', response.results[0]?.geometry?.location);
      } else {
        console.log('❌ API Error:', response.status);
        console.log('📝 Error message:', response.error_message || 'No error message');
        
        if (response.status === 'REQUEST_DENIED') {
          console.log('🔑 This usually means:');
          console.log('   - API key is invalid');
          console.log('   - API key restrictions are blocking the request');
          console.log('   - Billing is not enabled');
          console.log('   - Required APIs are not enabled');
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (error) => {
  console.error('❌ Network error:', error.message);
});
