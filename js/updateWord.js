const AWS = require('aws-sdk');
const https = require('https');

AWS.config.update({ region: 'eu-west-2' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'random_words';

function generateRandomWord() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'random-word-api.vercel.app',
      path: '/api?words=1&length=5',
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const result = JSON.parse(data);
        if (res.statusCode === 200 && Array.isArray(result) && result.length > 0) {
          resolve(result[0]);
        } else {
          reject(new Error('Failed to generate a random word.'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function updateWord() {
  try {
    const word = await generateRandomWord();

    const params = {
      TableName: tableName,
      Item: {
        id: '1',
        word,
        expiration_time: Math.floor(Date.now() / 1000) + 86400, // Set expiration time to 24 hours from now
      },
    };

    console.log(word);
    return dynamodb.put(params).promise();
  } catch (error) {
    throw new Error(`Error updating the word: ${error.message}`);
  }
}

exports.handler = async (event) => {
  try {
    await updateWord();
    console.log('Word updated successfully.');
    return {
      statusCode: 200,
      body: JSON.stringify('Word updated successfully.'),
    };
  } catch (error) {
    console.error('Error updating the word:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error updating the word.'),
    };
  }
};
