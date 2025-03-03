const AWS = require('aws-sdk');
const config = require('./default.js');

// Configure AWS
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

// Create DynamoDB document client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Utility functions for DynamoDB operations
const db = {
  // Get a single item by primary key
  async get(params) {
    try {
      const result = await dynamodb.get(params).promise();
      return result.Item;
    } catch (err) {
      console.error(`DynamoDB get error: ${err.message}`);
      throw err;
    }
  },

  // Query items
  async query(params) {
    try {
      const result = await dynamodb.query(params).promise();
      return result;
    } catch (err) {
      console.error(`DynamoDB query error: ${err.message}`);
      throw err;
    }
  },

  // Scan all items (use sparingly)
  async scan(params) {
    try {
      const result = await dynamodb.scan(params).promise();
      return result;
    } catch (err) {
      console.error(`DynamoDB scan error: ${err.message}`);
      throw err;
    }
  },

  // Put a single item
  async put(params) {
    try {
      await dynamodb.put(params).promise();
      return params.Item;
    } catch (err) {
      console.error(`DynamoDB put error: ${err.message}`);
      throw err;
    }
  },

  // Update an item
  async update(params) {
    try {
      const result = await dynamodb.update(params).promise();
      return result.Attributes;
    } catch (err) {
      console.error(`DynamoDB update error: ${err.message}`);
      throw err;
    }
  },

  // Delete an item
  async delete(params) {
    try {
      await dynamodb.delete(params).promise();
      return true;
    } catch (err) {
      console.error(`DynamoDB delete error: ${err.message}`);
      throw err;
    }
  },

  // Check if connection is working
  async testConnection() {
    try {
      // Try to scan with limit 1 to test connection
      await dynamodb.scan({ TableName: config.dynamoDBTables.posts, Limit: 1 }).promise();
      console.log('DynamoDB Connected...');
      return true;
    } catch (err) {
      console.error('DynamoDB Connection error:', err);
      throw err;
    }
  }
};

module.exports = db;
