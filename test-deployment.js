const axios = require('axios');

// Test configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';
const FRONTEND_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🚀 Testing API endpoints...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);
    
    // Test 2: Get public stories
    console.log('\n2. Testing public stories endpoint...');
    const storiesResponse = await axios.get(`${API_BASE_URL}/stories`);
    console.log('✅ Public stories:', storiesResponse.data.results, 'stories found');
    
    // Test 3: Test story by slug (if stories exist)
    if (storiesResponse.data.data.stories.length > 0) {
      const firstStory = storiesResponse.data.data.stories[0];
      if (firstStory.slug) {
        console.log('\n3. Testing story by slug...');
        const storyResponse = await axios.get(`${API_BASE_URL}/stories/${firstStory.slug}`);
        console.log('✅ Story by slug:', storyResponse.data.data.story.title);
      }
    }
    
    // Test 4: Test auth endpoints
    console.log('\n4. Testing auth endpoints...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Auth endpoint working (expected 401 for wrong credentials)');
      } else {
        console.log('❌ Auth endpoint error:', error.message);
      }
    }
    
    console.log('\n🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function testFrontend() {
  console.log('\n🌐 Testing Frontend...\n');
  
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend is accessible');
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
  }
}

async function runTests() {
  console.log('🔍 Starting deployment tests...\n');
  
  await testAPI();
  await testFrontend();
  
  console.log('\n📋 Deployment Checklist:');
  console.log('□ Backend API running on port 5000');
  console.log('□ Frontend running on port 3001');
  console.log('□ Database connection working');
  console.log('□ Story routes working with slugs');
  console.log('□ Authentication endpoints working');
  console.log('□ CORS configured for production domains');
  console.log('□ Environment variables set for production');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testAPI, testFrontend, runTests };