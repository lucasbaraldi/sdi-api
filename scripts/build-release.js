#!/usr/bin/env node

const { exec } = require('child_process');
const packageJson = require('../package.json');

const version = packageJson.version;
const outputFile = `./build/sdiApi_V_${version}.exe`;

console.log(`📦 Building SDI API v${version}`);
console.log(`📁 Output: ${outputFile}`);

// Comando para empacotamento
const pkgCommand = `npx @yao-pkg/pkg --config pkg.config.json --compress Brotli --output "${outputFile}" dist/main.js`;

console.log('🔨 Running pkg command...');
exec(pkgCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.log(`⚠️  Warnings:\n${stderr}`);
  }
  
  console.log(stdout);
  console.log(`✅ Successfully built: ${outputFile}`);
});
