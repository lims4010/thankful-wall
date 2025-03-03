# DynamoDB Documentation Scripts

This directory contains scripts to document your DynamoDB schema and generate TypeScript interfaces.

## Scripts

### document-db.js

This is the main script that runs all the documentation processes:
1. Extracts schema information from your DynamoDB tables
2. Generates TypeScript interfaces based on the schema
3. Creates a comprehensive markdown report

```bash
# Document all tables defined in your configuration
node scripts/document-db.js

# Document specific tables
node scripts/document-db.js thankful-wall-posts thankful-wall-limits
```

### document-schema.js

This script connects to your DynamoDB tables and extracts schema information:
- Table structure (key schema, attribute definitions)
- Sample data
- Field types and examples

```bash
# Document all tables defined in your configuration
node scripts/document-schema.js

# Document specific tables
node scripts/document-schema.js thankful-wall-posts thankful-wall-limits
```

### generate-interfaces.js

This script generates TypeScript interfaces from the schema documentation:
- Creates interfaces based on the table structure
- Infers types from sample data
- Includes examples as comments
- Annotates primary keys and sort keys with `@primaryKey` and `@sortKey` tags

```bash
node scripts/generate-interfaces.js
```

## Output

The scripts generate the following output:

- `server/schema-docs/`: JSON files containing the raw schema information
- `server/src/types/dynamodb-models.ts`: TypeScript interfaces for your DynamoDB models
- `server/docs/database-schema.md`: Comprehensive markdown documentation of your database schema

## Key Annotations in TypeScript Interfaces

The generated TypeScript interfaces include annotations for primary keys and sort keys:

```typescript
/**
 * TableName DynamoDB Model
 * @primaryKey hashKeyName
 * @sortKey rangeKeyName
 */
export interface TableName {
  /** Example: "example-value" | @primaryKey */
  hashKeyName: string;
  /** Example: "example-value" | @sortKey */
  rangeKeyName: string;
  // Other fields...
}
```

These annotations help you identify the key structure of your DynamoDB tables and can be used by tooling to generate appropriate query and update operations.

## Requirements

- Node.js
- AWS SDK configured with appropriate credentials
- Access to your DynamoDB tables

## Configuration

The scripts automatically use the table names defined in `server/config/default.js`:

```javascript
module.exports = {
  aws: {
    region: process.env.AWS_REGION || "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  dynamoDBTables: {
    posts: "thankful-wall-posts",
    limits: "thankful-wall-limits"
    // Add any other tables here
  }
};
```

The scripts will document all tables listed in the `dynamoDBTables` object by default.

## Troubleshooting

If you encounter errors:

1. Ensure your AWS credentials are correctly configured
2. Verify that the table names in your configuration are correct
3. Check that you have permission to access the DynamoDB tables
4. Make sure the required directories exist or can be created

## Examples

### Document all tables from configuration

```bash
node scripts/document-db.js
```

### Document a single table

```bash
node scripts/document-db.js thankful-wall-posts
```

### Document multiple specific tables

```bash
node scripts/document-db.js thankful-wall-posts thankful-wall-limits
``` 