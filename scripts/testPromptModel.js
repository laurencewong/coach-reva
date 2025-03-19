require('dotenv').config();
const Prompt = require('../server/models/Prompt');

// Test function to get a random prompt
async function testGetRandom() {
  try {
    console.log('Testing Prompt.getRandom()...');
    const prompt = await Prompt.getRandom();
    console.log('Random prompt result:', prompt || 'No prompt found');
  } catch (error) {
    console.error('Error in getRandom:', error);
  }
}

// Test function to get a prompt not recently sent
async function testGetNotRecentlySent() {
  try {
    // Using a fake user ID for testing
    const fakeUserId = '00000000-0000-0000-0000-000000000000';
    console.log(`Testing Prompt.getNotRecentlySent('${fakeUserId}')...`);
    const prompt = await Prompt.getNotRecentlySent(fakeUserId);
    console.log('Not recently sent prompt result:', prompt || 'No prompt found');
  } catch (error) {
    console.error('Error in getNotRecentlySent:', error);
  }
}

// Run the tests
async function runTests() {
  await testGetRandom();
  console.log('\n-------------------\n');
  await testGetNotRecentlySent();
}

runTests()
  .then(() => {
    console.log('\nTests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
