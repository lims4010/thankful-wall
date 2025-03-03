const fs = require('fs');
const path = require('path');

// Input and output directories
const schemaDir = path.join(__dirname, '../schema-docs');
const outputDir = path.join(__dirname, '../src/types');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Convert field type to TypeScript type
 * @param {Array<string>} types - Array of JavaScript types
 * @returns {string} - TypeScript type
 */
function convertToTsType(types) {
  if (!types || types.length === 0) {
    return 'any';
  }

  const typeMap = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'object': 'Record<string, any>',
    'array': 'any[]',
    'undefined': 'undefined',
    'null': 'null'
  };

  const tsTypes = types.map(type => typeMap[type] || 'any');
  return tsTypes.length === 1 ? tsTypes[0] : tsTypes.join(' | ');
}

/**
 * Generate TypeScript interface from schema
 * @param {Object} schema - Schema information
 * @param {string} interfaceName - Name of the interface
 * @param {Object} tableInfo - Table information including key schema
 * @returns {string} - TypeScript interface definition
 */
function generateInterface(schema, interfaceName, tableInfo) {
  if (!schema || !schema.fields || schema.fields.length === 0) {
    return `export interface ${interfaceName} {\n  [key: string]: any;\n}\n`;
  }

  // Extract key information
  const keySchema = tableInfo.keySchema || [];
  const hashKey = keySchema.find(key => key.KeyType === 'HASH')?.AttributeName;
  const rangeKey = keySchema.find(key => key.KeyType === 'RANGE')?.AttributeName;

  const fields = schema.fields.map(field => {
    const tsType = convertToTsType(field.types);
    let comment = '';
    
    // Add example to comment if available
    if (field.example !== undefined) {
      comment += `  /** Example: ${JSON.stringify(field.example)}`;
      
      // Add key annotations to comments
      if (field.name === hashKey) {
        comment += ' | @primaryKey';
      }
      if (field.name === rangeKey) {
        comment += ' | @sortKey';
      }
      
      comment += ' */\n';
    } else if (field.name === hashKey || field.name === rangeKey) {
      // Add key annotations even if no example
      comment += `  /**`;
      if (field.name === hashKey) {
        comment += ' @primaryKey';
      }
      if (field.name === rangeKey) {
        comment += ' @sortKey';
      }
      comment += ' */\n';
    }
    
    return `${comment}  ${field.name}: ${tsType};`;
  });

  // Add interface documentation with key information
  let interfaceDoc = `/**\n * ${interfaceName} DynamoDB Model\n`;
  if (hashKey) {
    interfaceDoc += ` * @primaryKey ${hashKey}\n`;
  }
  if (rangeKey) {
    interfaceDoc += ` * @sortKey ${rangeKey}\n`;
  }
  interfaceDoc += ` */\n`;

  return `${interfaceDoc}export interface ${interfaceName} {\n${fields.join('\n')}\n}\n`;
}

/**
 * Generate TypeScript interfaces from schema documentation
 */
function generateInterfaces() {
  try {
    console.log('Starting interface generation...');
    
    // Check if schema directory exists
    if (!fs.existsSync(schemaDir)) {
      console.error(`Schema directory not found: ${schemaDir}`);
      console.log('Please run document-schema.js first to generate schema documentation.');
      return;
    }
    
    // Get all schema files
    const schemaFiles = fs.readdirSync(schemaDir)
      .filter(file => file.endsWith('-schema.json'));
    
    if (schemaFiles.length === 0) {
      console.error('No schema files found. Please run document-schema.js first.');
      return;
    }
    
    // Generate interfaces for each schema
    const interfaces = [];
    
    schemaFiles.forEach(file => {
      const filePath = path.join(schemaDir, file);
      const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Generate interface name from table name
      const tableName = schema.tableName;
      const interfaceName = tableName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
        .replace(/s$/, ''); // Remove trailing 's' for singular form
      
      // Generate interface with key information
      const interfaceDefinition = generateInterface(schema.schema, interfaceName, {
        keySchema: schema.keySchema
      });
      interfaces.push(interfaceDefinition);
      
      console.log(`Generated interface for ${tableName}: ${interfaceName}`);
    });
    
    // Write interfaces to file
    const outputPath = path.join(outputDir, 'dynamodb-models.ts');
    fs.writeFileSync(outputPath, interfaces.join('\n'));
    
    console.log(`Interface generation complete. Output written to ${outputPath}`);
  } catch (err) {
    console.error('Error generating interfaces:', err);
  }
}

// Run the interface generation
generateInterfaces(); 