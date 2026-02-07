// Simple test script to check if server is receiving requests
const http = require('http');

const testData = JSON.stringify({
  name: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "test123"
});

const options = {
  hostname: '192.168.42.154',
  port: 8000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('🧪 Testing server connection...');
console.log(`Sending POST to http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`\n✅ Response received! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const json = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response is not JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.error('Make sure the server is running!');
});

req.write(testData);
req.end();

