#!/usr/bin/env node

/**
 * Patch the generated OpenNext worker to export Durable Objects
 * This script adds the DO export to the generated worker.js file
 */

const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', '.open-next', 'worker.js');
const doSourcePath = path.join(__dirname, '..', 'src', 'durable-objects', 'WebsiteDO.ts');

if (!fs.existsSync(workerPath)) {
  console.log('⚠️  Generated worker not found, skipping DO export patch');
  process.exit(0);
}

if (!fs.existsSync(doSourcePath)) {
  console.error('❌ Durable Object source file not found at:', doSourcePath);
  process.exit(1);
}

// Read the generated worker
let workerContent = fs.readFileSync(workerPath, 'utf-8');

// Check if already patched
if (workerContent.includes('export { WebsiteDO }') || workerContent.includes('class WebsiteDO')) {
  console.log('✅ Worker already patched with DO export');
  process.exit(0);
}

// Read the DO source file and inline it
const doSource = fs.readFileSync(doSourcePath, 'utf-8');
const typesPath = path.join(__dirname, '..', 'src', 'durable-objects', 'types.ts');
const typesSource = fs.readFileSync(typesPath, 'utf-8');

// Create the DO export code by inlining the source
// Remove the import statement and replace with inline types
let inlinedDO = doSource
  .replace(/import\s+{\s*DurableObject\s*}\s+from\s+["']cloudflare:workers["'];?/g, '')
  .replace(/import\s+type\s+{\s*CloudflareEnv\s*,\s*ChatMessage\s*}\s+from\s+["']\.\/types["'];?/g, '');

// Extract types from types.ts (remove export keyword)
let inlinedTypes = typesSource
  .replace(/export\s+interface/g, 'interface');

const doExportCode = `
// === Durable Object Export (added by patch-worker.js) ===
// Types
${inlinedTypes}

// Durable Object Class
${inlinedDO}

// Export the DO class
export { WebsiteDO };
`;

// Append the export at the end of the file
workerContent += '\n' + doExportCode;

// Write the patched worker
try {
  fs.writeFileSync(workerPath, workerContent, 'utf-8');
  console.log('✅ Successfully patched worker.js with Durable Object export');
  console.log('   - Inlined types and WebsiteDO class');
  console.log('   - Worker file size:', Math.round(workerContent.length / 1024), 'KB');
} catch (error) {
  console.error('❌ Failed to write patched worker:', error.message);
  process.exit(1);
}
