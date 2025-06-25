#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const authPagesDir = path.join(__dirname, '../router/pages/auth');

console.log('🔍 Verifying input field border styling...\n');

// Get all auth page files
const authFiles = fs.readdirSync(authPagesDir).filter(file => file.endsWith('.tsx'));

let allHaveCorrectBorders = true;
let totalInputFields = 0;
let correctlyStyledFields = 0;

authFiles.forEach(file => {
  const filePath = path.join(authPagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all input field className attributes
  const inputMatches = content.match(/className="[^"]*h-14[^"]*border-[^"]*"/g) || [];
  
  console.log(`📄 ${file}:`);
  
  if (inputMatches.length === 0) {
    console.log(`  ⚠️  No input fields found`);
  } else {
    let hasCorrectStyling = true;
    
    inputMatches.forEach((match, index) => {
      totalInputFields++;
      if (match.includes('border-2 border-gray-400') && match.includes('!border-solid')) {
        console.log(`  ✅ Input ${index + 1}: Has correct border (border-gray-400 + !border-solid)`);
        correctlyStyledFields++;
      } else if (match.includes('border-2 border-gray-400')) {
        console.log(`  ⚠️  Input ${index + 1}: Has border-gray-400 but missing !border-solid`);
        console.log(`     ${match}`);
        hasCorrectStyling = false;
        allHaveCorrectBorders = false;
      } else if (match.includes('border-gray-300') || match.includes('border-gray-200') || match.includes('border-gray-100')) {
        console.log(`  ❌ Input ${index + 1}: Uses weak border styling`);
        console.log(`     ${match}`);
        hasCorrectStyling = false;
        allHaveCorrectBorders = false;
      } else {
        console.log(`  ⚠️  Input ${index + 1}: Unknown border styling`);
        console.log(`     ${match}`);
      }
    });
    
    if (hasCorrectStyling) {
      console.log(`  ✅ All ${inputMatches.length} input field(s) have correct styling`);
    }
  }
  
  console.log('');
});

// Check for any remaining overlay rings
console.log('🔍 Checking for overlay rings...');
let hasOverlayRings = false;

authFiles.forEach(file => {
  const filePath = path.join(authPagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('ring-1 ring-inset')) {
    console.log(`❌ ${file}: Still has overlay rings`);
    hasOverlayRings = true;
  }
});

if (!hasOverlayRings) {
  console.log('✅ No overlay rings found');
}

console.log('\n' + '='.repeat(50));
if (allHaveCorrectBorders && !hasOverlayRings) {
  console.log('🎉 All input fields have visible borders!');
  console.log(`✅ ${correctlyStyledFields}/${totalInputFields} input fields properly styled`);
  console.log('✅ No overlay rings interfering with borders');
} else {
  console.log('❌ Some input fields still need fixing');
  console.log(`⚠️  ${correctlyStyledFields}/${totalInputFields} input fields properly styled`);
  if (hasOverlayRings) {
    console.log('❌ Overlay rings still present');
  }
}
console.log('='.repeat(50));
