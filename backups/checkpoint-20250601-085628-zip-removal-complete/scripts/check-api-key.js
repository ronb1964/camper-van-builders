// Simple script to check if Google Maps API key is available
console.log('🔍 Checking Google Maps API Key...');
console.log('Environment variables available:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_GOOGLE_MAPS_API_KEY exists:', !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
console.log('REACT_APP_GOOGLE_MAPS_API_KEY length:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.length || 0);

if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
  console.log('✅ API Key is set!');
  console.log('First 10 characters:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
} else {
  console.log('❌ API Key is NOT set!');
  console.log('');
  console.log('To fix this:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add this line: REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here');
  console.log('3. Get an API key from: https://console.cloud.google.com/');
  console.log('4. Enable the Maps JavaScript API');
  console.log('5. Restart the development server');
}
