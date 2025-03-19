require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get a Firebase ID token (you'll need to paste this in)
async function testPromptService() {
  try {
    rl.question('Enter your Firebase ID token: ', async (idToken) => {
      console.log('Testing GET /api/prompts/daily endpoint...');
      
      try {
        const response = await axios.get('http://localhost:3001/api/prompts/daily', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        
        console.log('Success! Response:');
        console.log(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('Error calling prompt service:');
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
        }
      } finally {
        rl.close();
      }
    });
  } catch (error) {
    console.error('Error in test script:', error);
    rl.close();
  }
}

testPromptService();
