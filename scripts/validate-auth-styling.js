#!/usr/bin/env node

/**
 * Validation script for auth page styling consistency
 * Checks that all auth pages have proper input styling and no security claims
 */

const fs = require('fs');
const path = require('path');

const authPagesDir = path.join(__dirname, '..', 'router', 'pages', 'auth');
const authLayoutFile = path.join(__dirname, '..', 'router', 'components', 'router-auth-layout.tsx');

const requiredInputStyling = 'border-2 border-gray-300 focus:border-[#eb6e03]';
const forbiddenSecurityTerms = ['bank.grade', 'SSL', 'GDPR', 'SOC', 'encrypted', 'security', 'compliance'];

let validationErrors = [];

function validateFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check input styling
  const hasInput = content.includes('<Input');
  if (hasInput) {
    if (!content.includes(requiredInputStyling)) {
      validationErrors.push(`${fileName}: Missing required input styling`);
    }
  }
  
  // Check for forbidden security terms
  forbiddenSecurityTerms.forEach(term => {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      validationErrors.push(`${fileName}: Contains forbidden security term: ${term}`);
    }
  });
  
  // Check RouterAuthLayout usage
  if (!content.includes('RouterAuthLayout')) {
    validationErrors.push(`${fileName}: Missing RouterAuthLayout import/usage`);
  }
}

// Validate auth pages
const authFiles = fs.readdirSync(authPagesDir).filter(file => file.endsWith('.tsx'));
authFiles.forEach(file => {
  const filePath = path.join(authPagesDir, file);
  validateFile(filePath, `auth/${file}`);
});

// Validate auth layout
validateFile(authLayoutFile, 'router-auth-layout.tsx');

// Report results
if (validationErrors.length === 0) {
  console.log('✅ All auth pages validation passed!');
  console.log('📋 Validated:');
  console.log(`   • ${authFiles.length} auth pages`);
  console.log(`   • RouterAuthLayout component`);
  console.log('🎯 Checks performed:');
  console.log('   • Input styling consistency');
  console.log('   • No security/compliance claims');
  console.log('   • RouterAuthLayout usage');
} else {
  console.log('❌ Validation failed:');
  validationErrors.forEach(error => console.log(`   ${error}`));
  process.exit(1);
}
