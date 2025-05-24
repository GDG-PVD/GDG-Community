#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test files that need updating
const testFiles = [
  'src/ui/src/pages/BucketTest.tsx',
  'src/ui/src/pages/DirectStorageTest.tsx',
  'src/ui/src/pages/FreshTest.tsx',
  'src/ui/src/pages/OrderTest.tsx',
  'src/ui/src/pages/SimpleStorageTest.tsx'
];

// The hardcoded config to replace
const hardcodedConfig = `{
        apiKey: "AIzaSyAURUxyxb8Y5mrt8hFTrBlUj0u5jmlTcDI",
        authDomain: "gdg-community-companion.firebaseapp.com",
        projectId: "gdg-community-companion",
        storageBucket: "gdg-community-companion.firebasestorage.app",
        messagingSenderId: "512932129357",
        appId: "1:512932129357:web:d390c9196e480a489d0a04"
      }`;

// Regex patterns to match various formats
const patterns = [
  // Multi-line object format
  /{\s*apiKey:\s*["']AIzaSyAURUxyxb8Y5mrt8hFTrBlUj0u5jmlTcDI["'],[\s\S]*?appId:\s*["'][^"']+["']\s*}/g,
  // Single line format
  /{\s*apiKey:\s*["']AIzaSyAURUxyxb8Y5mrt8hFTrBlUj0u5jmlTcDI["'][^}]+}/g
];

console.log('Updating test files to use environment-based configuration...\n');

testFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Check if already has the import
  const hasImport = content.includes('firebase.test.config');
  
  // Add import if needed
  if (!hasImport && content.includes('AIzaSyAURUxyxb8Y5mrt8hFTrBlUj0u5jmlTcDI')) {
    // Find the last import statement
    const importMatch = content.match(/^import.*?;$/gm);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      const importStatement = "import { testFirebaseConfig } from '../config/firebase.test.config';";
      content = content.replace(lastImport, lastImport + '\n' + importStatement);
      modified = true;
    }
  }
  
  // Replace hardcoded configs
  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, 'testFirebaseConfig');
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\nDone!');