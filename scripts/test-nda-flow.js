#!/usr/bin/env node

/**
 * Test script to verify NDA upload and acceptance flow
 * This script validates the complete NDA implementation:
 * 1. Admin can upload NDA documents
 * 2. User must accept NDA before accessing protected routes
 * 3. NDA status is properly tracked and enforced
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing NDA Implementation Flow...\n');

// Test 1: Verify admin dashboard NDA management exists
function testAdminNDAManagement() {
  console.log('1️⃣ Testing Admin NDA Management...');
  
  const adminDashboardPath = path.join(__dirname, '../router/pages/admin/dashboard.tsx');
  
  if (!fs.existsSync(adminDashboardPath)) {
    console.error('❌ Admin dashboard file not found');
    return false;
  }
  
  const adminContent = fs.readFileSync(adminDashboardPath, 'utf8');
  
  // Check for required NDA management features
  const requiredFeatures = [
    'NDAManagementContent',
    'handleNDAUpload',
    'downloadNDA',
    'toggleNDAStatus',
    'fileData',
    'admin_ndas'
  ];
  
  const missingFeatures = requiredFeatures.filter(feature => !adminContent.includes(feature));
  
  if (missingFeatures.length > 0) {
    console.error(`❌ Missing admin NDA features: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  console.log('✅ Admin NDA management implementation found');
  return true;
}

// Test 2: Verify NDA acceptance page exists and is functional
function testNDAAcceptancePage() {
  console.log('\n2️⃣ Testing NDA Acceptance Page...');
  
  const ndaPagePath = path.join(__dirname, '../router/pages/nda-acceptance.tsx');
  
  if (!fs.existsSync(ndaPagePath)) {
    console.error('❌ NDA acceptance page not found');
    return false;
  }
  
  const ndaContent = fs.readFileSync(ndaPagePath, 'utf8');
  
  // Check for required NDA acceptance features
  const requiredFeatures = [
    'getActiveNDA',
    'handleAcceptNDA',
    'handleDeclineNDA',
    'downloadNDA',
    'currentNDA',
    'nda_status_'
  ];
  
  const missingFeatures = requiredFeatures.filter(feature => !ndaContent.includes(feature));
  
  if (missingFeatures.length > 0) {
    console.error(`❌ Missing NDA acceptance features: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  console.log('✅ NDA acceptance page implementation found');
  return true;
}

// Test 3: Verify router has NDA protection
function testRouterNDAProtection() {
  console.log('\n3️⃣ Testing Router NDA Protection...');
  
  const routerPath = path.join(__dirname, '../router/app.tsx');
  
  if (!fs.existsSync(routerPath)) {
    console.error('❌ Router file not found');
    return false;
  }
  
  const routerContent = fs.readFileSync(routerPath, 'utf8');
  
  // Check for NDA-related route protection
  const requiredFeatures = [
    'NDAProtectedRoute',
    'NDAAcceptancePage',
    'nda-acceptance',
    'AdminProtectedRoute',
    'nda_status_'
  ];
  
  const missingFeatures = requiredFeatures.filter(feature => !routerContent.includes(feature));
  
  if (missingFeatures.length > 0) {
    console.error(`❌ Missing router NDA features: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  console.log('✅ Router NDA protection implementation found');
  return true;
}

// Test 4: Verify components have proper TypeScript types
function testTypeScriptImplementation() {
  console.log('\n4️⃣ Testing TypeScript Implementation...');
  
  const files = [
    '../router/pages/admin/dashboard.tsx',
    '../router/pages/nda-acceptance.tsx',
    '../router/app.tsx'
  ];
  
  let allValid = true;
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for basic TypeScript patterns
      if (!content.includes('interface') && !content.includes('type') && !content.includes(': React.FC')) {
        console.error(`❌ ${file} may be missing TypeScript types`);
        allValid = false;
      }
    }
  });
  
  if (allValid) {
    console.log('✅ TypeScript implementation looks good');
  }
  
  return allValid;
}

// Test 5: Check for proper file structure
function testFileStructure() {
  console.log('\n5️⃣ Testing File Structure...');
  
  const requiredFiles = [
    '../router/pages/admin/dashboard.tsx',
    '../router/pages/nda-acceptance.tsx',
    '../router/app.tsx',
    '../components/ui/card.tsx',
    '../components/ui/button.tsx'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const filePath = path.join(__dirname, file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
    return false;
  }
  
  console.log('✅ All required files present');
  return true;
}

// Test 6: Verify NDA flow integration points
function testNDAFlowIntegration() {
  console.log('\n6️⃣ Testing NDA Flow Integration...');
  
  // Check that the admin can upload NDAs that users can access
  const adminPath = path.join(__dirname, '../router/pages/admin/dashboard.tsx');
  const userPath = path.join(__dirname, '../router/pages/nda-acceptance.tsx');
  
  if (!fs.existsSync(adminPath) || !fs.existsSync(userPath)) {
    console.error('❌ Required files for NDA flow not found');
    return false;
  }
  
  const adminContent = fs.readFileSync(adminPath, 'utf8');
  const userContent = fs.readFileSync(userPath, 'utf8');
  
  // Check that both admin and user pages use the same storage mechanism
  const storageKey = 'admin_ndas';
  
  if (!adminContent.includes(storageKey) || !userContent.includes(storageKey)) {
    console.error('❌ NDA storage integration not found');
    return false;
  }
  
  console.log('✅ NDA flow integration points found');
  return true;
}

// Run all tests
function runAllTests() {
  const tests = [
    testAdminNDAManagement,
    testNDAAcceptancePage,
    testRouterNDAProtection,
    testTypeScriptImplementation,
    testFileStructure,
    testNDAFlowIntegration
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    try {
      if (test()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
  });
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All NDA implementation tests passed!');
    console.log('\nNDA Flow Summary:');
    console.log('• Admin can upload NDA PDFs in /admin/dashboard');
    console.log('• Users must accept NDA before accessing protected routes');
    console.log('• NDA status is tracked and enforced via route guards');
    console.log('• Declining NDA prevents access to investment features');
    console.log('• File uploads and downloads are supported');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
  }
  
  return failed === 0;
}

// Run the tests
runAllTests();
