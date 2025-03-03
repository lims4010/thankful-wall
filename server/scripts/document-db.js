const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getConfigTableNames } = require('./document-schema');

// Paths
const schemaDir = path.join(__dirname, '../schema-docs');
const outputDir = path.join(__dirname, '../docs');
const markdownPath = path.join(outputDir, 'database-schema.md');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Run a script and return its output
 * @param {string} scriptPath - Path to the script
 * @param {Array<string>} args - Command line arguments
 * @returns {string} - Command output
 */
function runScript(scriptPath, args = []) {
  try {
    const argsString = args.length > 0 ? ' ' + args.join(' ') : '';
    console.log(`Running script: ${scriptPath}${argsString}`);
    return execSync(`node ${scriptPath}${argsString}`, { encoding: 'utf8' });
  } catch (err) {
    console.error(`Error running script ${scriptPath}:`, err);
    return err.toString();
  }
}

/**
 * Generate markdown documentation from schema files
 * Note: This function is no longer used but kept for reference
 */
function generateMarkdown() {
  try {
    console.log('Skipping markdown documentation generation...');
    // Function is kept for reference but no longer executes the markdown generation
  } catch (err) {
    console.error('Error generating markdown:', err);
  }
}

/**
 * Main function
 * @param {Array<string>} tableNames - Optional array of table names to document
 */
async function main(tableNames = []) {
  console.log('Starting database documentation process...');
  
  // Use provided table names or get from config
  const tablesToDocument = tableNames.length > 0 ? tableNames : getConfigTableNames();
  
  console.log(`Documenting tables: ${tablesToDocument.join(', ')}`);
  
  // Run schema documentation script with table names
  const schemaOutput = runScript(path.join(__dirname, 'document-schema.js'), tablesToDocument);
  console.log(schemaOutput);
  
  // Run interface generation script
  const interfaceOutput = runScript(path.join(__dirname, 'generate-interfaces.js'));
  console.log(interfaceOutput);
  
  // Skip markdown documentation generation
  console.log('Skipping markdown documentation generation...');
  
  console.log('Database documentation process complete.');
}

// Get table names from command line arguments
const tableNames = process.argv.slice(2);

// Run the main function with specified table names
main(tableNames); 