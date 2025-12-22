#!/usr/bin/env node

/**
 * Patch the generated OpenNext worker to export Durable Objects
 * This script adds the DO export to the generated worker.js file
 */

const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', '.open-next', 'worker.js');

if (!fs.existsSync(workerPath)) {
  console.log('⚠️  Generated worker not found, skipping DO export patch');
  process.exit(0);
}

// Read the generated worker
let workerContent = fs.readFileSync(workerPath, 'utf-8');

// Check if already patched
if (workerContent.includes('export { WebsiteDO }')) {
  console.log('✅ Worker already patched with DO export');
  process.exit(0);
}

// Add the Durable Object export
// We need to add it in a way that the bundler can resolve it
const doExportCode = `
// === Durable Object Export (added by patch-worker.js) ===
export { WebsiteDO } from "../src/durable-objects/WebsiteDO.ts";
`;

// Append the export at the end of the file
workerContent += '\n' + doExportCode;

// Write the patched worker
fs.writeFileSync(workerPath, workerContent, 'utf-8');

console.log('✅ Successfully patched worker.js with Durable Object export');
