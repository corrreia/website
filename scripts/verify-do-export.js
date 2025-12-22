#!/usr/bin/env node

/**
 * Verify that the Durable Object is properly exported in the worker
 */

const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', '.open-next', 'worker.js');

if (!fs.existsSync(workerPath)) {
  console.error('❌ Worker file not found at:', workerPath);
  process.exit(1);
}

const workerContent = fs.readFileSync(workerPath, 'utf-8');

// Check for DO export
const hasExport = workerContent.includes('export { WebsiteDO }') || 
                  workerContent.includes('export{WebsiteDO}');
const hasClass = workerContent.includes('class WebsiteDO');
const hasDurableObject = workerContent.includes('DurableObject');

console.log('\n🔍 Durable Object Export Verification\n');
console.log('Worker file:', workerPath);
console.log('File size:', Math.round(workerContent.length / 1024), 'KB');
console.log('\nChecks:');
console.log('  ✓ Has WebsiteDO export:', hasExport ? '✅' : '❌');
console.log('  ✓ Has WebsiteDO class:', hasClass ? '✅' : '❌');
console.log('  ✓ References DurableObject:', hasDurableObject ? '✅' : '❌');

if (hasExport && hasClass) {
  console.log('\n✅ Durable Object appears to be properly exported!\n');
  process.exit(0);
} else {
  console.log('\n❌ Durable Object export verification FAILED!\n');
  console.log('Please run: npm run patch-worker\n');
  process.exit(1);
}
