const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/default');

// Configure AWS
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

// Create DynamoDB and DocumentClient instances
const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

// Output directory for schema documentation
const outputDir = path.join(__dirname, '../schema-docs');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

/**
 * Get table information
 * @param {string} tableName - The name of the table
 * @returns {Promise<Object>} - Table description
 */
async function getTableInfo(tableName) {
  try {
    const result = await dynamoDB.describeTable({ TableName: tableName }).promise();
    return result.Table;
  } catch (err) {
    console.error(`Error describing table ${tableName}:`, err);
    throw err;
  }
}

/**
 * Get sample items from a table
 * @param {string} tableName - The name of the table
 * @param {number} limit - Maximum number of items to retrieve
 * @returns {Promise<Array>} - Array of items
 */
async function getSampleItems(tableName, limit = 5) {
  try {
    const params = {
      TableName: tableName,
      Limit: limit
    };
    const result = await documentClient.scan(params).promise();
    return result.Items;
  } catch (err) {
    console.error(`Error scanning table ${tableName}:`, err);
    throw err;
  }
}

/**
 * Extract schema from sample items
 * @param {Array} items - Sample items from the table
 * @returns {Object} - Schema information
 */
function extractSchema(items) {
  if (!items || items.length === 0) {
    return { fields: [] };
  }

  // Combine all possible fields from all items
  const allFields = new Set();
  const fieldTypes = {};
  const fieldExamples = {};

  items.forEach(item => {
    Object.keys(item).forEach(field => {
      allFields.add(field);
      
      const value = item[field];
      const type = Array.isArray(value) ? 'array' : typeof value;
      
      if (!fieldTypes[field]) {
        fieldTypes[field] = new Set();
      }
      fieldTypes[field].add(type);
      
      if (!fieldExamples[field] && value !== null && value !== undefined) {
        fieldExamples[field] = value;
      }
    });
  });

  // Convert to array of field information
  const fields = Array.from(allFields).map(field => ({
    name: field,
    types: Array.from(fieldTypes[field] || []),
    example: fieldExamples[field]
  }));

  return { fields };
}

/**
 * Document a table's schema
 * @param {string} tableName - The name of the table
 */
async function documentTable(tableName) {
  try {
    console.log(`Documenting schema for table: ${tableName}`);
    
    // Get table information
    const tableInfo = await getTableInfo(tableName);
    
    // Get sample items
    const sampleItems = await getSampleItems(tableName);
    
    // Extract schema from sample items
    const schema = extractSchema(sampleItems);
    
    // Create documentation object
    const documentation = {
      tableName,
      creationDateTime: tableInfo.CreationDateTime,
      keySchema: tableInfo.KeySchema,
      attributeDefinitions: tableInfo.AttributeDefinitions,
      provisionedThroughput: tableInfo.ProvisionedThroughput,
      tableStatus: tableInfo.TableStatus,
      schema,
      sampleItems
    };
    
    // Write to file
    const filePath = path.join(outputDir, `${tableName}-schema.json`);
    fs.writeFileSync(filePath, JSON.stringify(documentation, null, 2));
    
    console.log(`Schema documentation for ${tableName} written to ${filePath}`);
    
    return documentation;
  } catch (err) {
    console.error(`Error documenting table ${tableName}:`, err);
    throw err;
  }
}

/**
 * Get all table names from the configuration
 * @returns {Array<string>} Array of table names
 */
function getConfigTableNames() {
  return Object.values(config.dynamoDBTables);
}

/**
 * Document specified tables or all tables in the configuration
 * @param {Array<string>} tableNames - Optional array of table names to document
 */
async function documentTables(tableNames) {
  try {
    console.log('Starting schema documentation process...');
    
    // If no table names provided, use all from config
    const tablesToDocument = tableNames && tableNames.length > 0 
      ? tableNames 
      : getConfigTableNames();
    
    console.log(`Will document the following tables: ${tablesToDocument.join(', ')}`);
    
    // Document each table
    const documentations = await Promise.all(
      tablesToDocument.map(tableName => documentTable(tableName))
    );
    
    // Create index file
    const indexPath = path.join(outputDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify({
      tables: documentations.map(doc => ({
        tableName: doc.tableName,
        keySchema: doc.keySchema,
        fields: doc.schema.fields.map(f => f.name)
      }))
    }, null, 2));
    
    console.log(`Schema documentation complete. Index written to ${indexPath}`);
    return documentations;
  } catch (err) {
    console.error('Error documenting schemas:', err);
    throw err;
  }
}

// Get table names from command line arguments
const tableNames = process.argv.slice(2);

// Run the documentation process with specified table names
if (require.main === module) {
  documentTables(tableNames)
    .then(() => console.log('Documentation completed successfully'))
    .catch(err => {
      console.error('Documentation failed:', err);
      process.exit(1);
    });
}

module.exports = { documentTables, getConfigTableNames }; 