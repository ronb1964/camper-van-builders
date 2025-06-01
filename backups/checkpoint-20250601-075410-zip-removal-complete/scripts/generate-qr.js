const qrcode = require('qrcode-terminal');
const os = require('os');

// Get the network interfaces
const networkInterfaces = os.networkInterfaces();

// Find all IPv4 addresses that are not internal
const addresses = [];
Object.keys(networkInterfaces).forEach((interfaceName) => {
  const interfaces = networkInterfaces[interfaceName];
  interfaces.forEach((iface) => {
    // Skip internal and non-IPv4 addresses
    if (!iface.internal && iface.family === 'IPv4') {
      addresses.push(iface.address);
    }
  });
});

// Use the first non-internal IPv4 address or localhost as fallback
const ipAddress = addresses.length > 0 ? addresses[0] : 'localhost';
const port = 45053; // The port from the serve command
const url = `http://${ipAddress}:${port}`;

console.log(`\nCamper Van Builders App is running at: ${url}`);
console.log('\nScan this QR code with your iPhone camera to open the app:\n');

// Generate QR code
qrcode.generate(url, { small: true });

console.log('\nMake sure your iPhone is connected to the same WiFi network as this computer.');
console.log('The app will be accessible as long as this server is running.');
