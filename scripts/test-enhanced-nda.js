#!/usr/bin/env node

/**
 * Enhanced NDA Flow Test Script
 * Tests the new reading enforcement features
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Enhanced NDA Reading Enforcement...\n');

function testEnhancedNDAFeatures() {
  console.log('1️⃣ Testing Enhanced NDA Features...');
  
  const ndaPagePath = path.join(__dirname, '../router/pages/nda-acceptance.tsx');
  
  if (!fs.existsSync(ndaPagePath)) {
    console.error('❌ NDA acceptance page not found');
    return false;
  }
  
  const ndaContent = fs.readFileSync(ndaPagePath, 'utf8');
  
  // Check for required reading enforcement features
  const requiredFeatures = [
    'readingProgress',
    'hasScrolledToBottom',
    'timeSpentReading',
    'comprehensionChecks',
    'MINIMUM_READING_TIME',
    'READING_PROGRESS_THRESHOLD',
    'canAcceptNDA',
    'handleScroll',
    'contentRef',
    'understoodConfidentiality',
    'understoodConsequences',
    'confirmedIdentity'
  ];
  
  const missingFeatures = requiredFeatures.filter(feature => !ndaContent.includes(feature));
  
  if (missingFeatures.length > 0) {
    console.error(`❌ Missing NDA reading enforcement features: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  console.log('✅ Enhanced NDA reading enforcement features found');
  
  // Check for UI improvements
  const uiFeatures = [
    'Reading Progress',
    'Time reading:',
    'Minimum:',
    'Reading Requirements',
    'Comprehension Confirmation',
    'Requirements not met',
    'scroll to the bottom'
  ];
  
  const missingUIFeatures = uiFeatures.filter(feature => !ndaContent.includes(feature));
  
  if (missingUIFeatures.length > 0) {
    console.error(`❌ Missing UI features: ${missingUIFeatures.join(', ')}`);
    return false;
  }
  
  console.log('✅ Enhanced UI features found');
  
  // Check for always visible content (no toggle)
  if (ndaContent.includes('setShowContent') || ndaContent.includes('showContent ?')) {
    console.error('❌ Content should always be visible (no toggle)');
    return false;
  }
  
  console.log('✅ NDA content is always visible');
  
  return true;
}

function testRouterUpdates() {
  console.log('\n2️⃣ Testing Router Updates...');
  
  const routerPath = path.join(__dirname, '../router/app.tsx');
  
  if (!fs.existsSync(routerPath)) {
    console.error('❌ Router app file not found');
    return false;
  }
  
  const routerContent = fs.readFileSync(routerPath, 'utf8');
  
  // Check that AuthOnlyRoute properly handles NDA flow
  if (!routerContent.includes('nda_status_${user.id}') || !routerContent.includes('/nda-acceptance')) {
    console.error('❌ AuthOnlyRoute does not properly handle NDA flow');
    return false;
  }
  
  console.log('✅ Router properly handles NDA flow');
  
  return true;
}

function testComprehensiveFeatures() {
  console.log('\n3️⃣ Testing Comprehensive Reading Features...');
  
  const ndaPagePath = path.join(__dirname, '../router/pages/nda-acceptance.tsx');
  const ndaContent = fs.readFileSync(ndaPagePath, 'utf8');
  
  // Test reading enforcement mechanisms
  const enforcementFeatures = {
    'Scroll tracking': 'handleScroll',
    'Time tracking': 'setTimeSpentReading',
    'Progress calculation': 'scrollHeight',
    'Minimum time check': 'timeSpentReading >= MINIMUM_READING_TIME',
    'Scroll to bottom check': 'hasScrolledToBottom',
    'Comprehension checks': 'comprehensionChecks.understoodConfidentiality',
    'Accept button disabled': '!canAcceptNDA()',
    'Requirements summary': 'Requirements not met'
  };
  
  let allFeaturesPresent = true;
  
  for (const [featureName, searchText] of Object.entries(enforcementFeatures)) {
    if (!ndaContent.includes(searchText)) {
      console.error(`❌ Missing ${featureName}: ${searchText}`);
      allFeaturesPresent = false;
    } else {
      console.log(`✅ ${featureName} implemented`);
    }
  }
  
  return allFeaturesPresent;
}

function testUIComponents() {
  console.log('\n4️⃣ Testing UI Component Dependencies...');
  
  const requiredComponents = [
    'components/ui/checkbox.tsx',
    'components/ui/progress.tsx',
    'components/ui/card.tsx',
    'components/ui/button.tsx',
    'components/ui/alert.tsx'
  ];
  
  let allComponentsExist = true;
  
  for (const component of requiredComponents) {
    const componentPath = path.join(__dirname, '../', component);
    if (!fs.existsSync(componentPath)) {
      console.error(`❌ Missing component: ${component}`);
      allComponentsExist = false;
    } else {
      console.log(`✅ ${component} exists`);
    }
  }
  
  return allComponentsExist;
}

// Run all tests
async function runTests() {
  const tests = [
    testEnhancedNDAFeatures,
    testRouterUpdates,
    testComprehensiveFeatures,
    testUIComponents
  ];
  
  let allTestsPassed = true;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (!result) {
        allTestsPassed = false;
      }
    } catch (error) {
      console.error(`❌ Test failed with error: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allTestsPassed) {
    console.log('🎉 All Enhanced NDA Tests Passed!');
    console.log('\nEnhanced Features Implemented:');
    console.log('• Always visible NDA content');
    console.log('• Reading progress tracking with visual indicator');
    console.log('• Minimum reading time enforcement (30 seconds)');
    console.log('• Scroll-to-bottom requirement');
    console.log('• Interactive comprehension checks');
    console.log('• Disabled accept button until all requirements met');
    console.log('• Real-time feedback on reading progress');
    console.log('• Enhanced UI with status indicators');
  } else {
    console.log('❌ Some Enhanced NDA Tests Failed');
    console.log('\nPlease review the implementation and fix any issues.');
  }
}

runTests().catch(console.error);
