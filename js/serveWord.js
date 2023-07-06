const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-2' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'random_words';

exports.handler = async (event) => {
  try {
    const params = {
      TableName: tableName,
    };

    const { Item } = await dynamodb.scan(params).promise();

    if (!Item || !Item.word) {
      return {
        statusCode: 404,
        body: 'Word not found',
      };
    }

    return {
      statusCode: 200,
      body: Item.word,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
