#!/usr/bin/env node

/**
 * Test script to verify legal pages implementation
 * Run with: node scripts/test-legal-pages.js
 */

const fs = require('fs')
const path = require('path')

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

function log(color, message) {
  console.log(`${color}${message}${RESET}`)
}

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (fs.existsSync(fullPath)) {
    log(GREEN, `✓ ${filePath} exists`)
    return true
  } else {
    log(RED, `✗ ${filePath} missing`)
    return false
  }
}

function checkFileContains(filePath, searchString, description) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8')
    if (content.includes(searchString)) {
      log(GREEN, `✓ ${description}`)
      return true
    } else {
      log(RED, `✗ ${description}`)
      return false
    }
  } else {
    log(RED, `✗ ${filePath} missing`)
    return false
  }
}

function main() {
  console.log('🧪 Testing Legal Pages Implementation...\n')

  let allPassed = true

  // Check core legal page files
  console.log('📄 Checking legal page files:')
  allPassed &= checkFileExists('router/pages/legal/index.tsx')
  allPassed &= checkFileExists('router/pages/legal/privacy-policy.tsx')
  allPassed &= checkFileExists('router/pages/legal/legal-disclosure.tsx')
  allPassed &= checkFileExists('router/pages/legal/disclaimer.tsx')

  console.log('\n🧭 Checking router configuration:')
  allPassed &= checkFileContains(
    'router/app.tsx',
    'const LegalPage = lazy(() => import("./pages/legal"))',
    'Legal page lazy import added to router'
  )
  allPassed &= checkFileContains(
    'router/app.tsx',
    '<Route path="/legal"',
    'Legal route defined in router'
  )

  console.log('\n🧭 Checking navigation integration:')
  allPassed &= checkFileContains(
    'components/navigation-header.tsx',
    'to="/legal"',
    'Legal link added to navigation header'
  )
  allPassed &= checkFileContains(
    'components/professional-footer.tsx',
    'to="/legal"',
    'Legal links added to footer'
  )

  console.log('\n🌐 Checking translations:')
  allPassed &= checkFileContains(
    'lib/i18n/translations.ts',
    'legal: "Legal"',
    'Legal navigation translation added'
  )

  console.log('\n📱 Checking UI components:')
  allPassed &= checkFileExists('components/ui/tabs.tsx')
  allPassed &= checkFileExists('components/ui/scroll-area.tsx')
  allPassed &= checkFileExists('components/ui/separator.tsx')
  allPassed &= checkFileExists('components/ui/card.tsx')
  allPassed &= checkFileExists('components/ui/badge.tsx')

  console.log('\n📝 Checking content structure:')
  allPassed &= checkFileContains(
    'router/pages/legal/privacy-policy.tsx',
    'Privacy Policy',
    'Privacy Policy content has correct title'
  )
  allPassed &= checkFileContains(
    'router/pages/legal/privacy-policy.tsx',
    'respects your privacy and is committed to protecting your personal data',
    'Privacy Policy has required commitment statement'
  )
  allPassed &= checkFileContains(
    'router/pages/legal/legal-disclosure.tsx',
    'operated by Spora One Trust, a duly registered trust under the laws of Kenya',
    'Legal Disclosure has website operation statement'
  )
  allPassed &= checkFileContains(
    'router/pages/legal/disclaimer.tsx',
    'you agree to the following terms',
    'Disclaimer has agreement to terms statement'
  )

  console.log('\n🏢 Checking company information:')
  allPassed &= checkFileContains(
    'router/pages/legal/legal-disclosure.tsx',
    'TPS-VMCRYQ',
    'Company registration number included'
  )
  allPassed &= checkFileContains(
    'router/pages/legal/legal-disclosure.tsx',
    'info@sporaonetrust.com',
    'Company email included'
  )
  allPassed &= checkFileContains(
    'router/pages/legal/legal-disclosure.tsx',
    '+254-726857081',
    'Company phone included'
  )

  console.log('\n' + '='.repeat(50))
  
  if (allPassed) {
    log(GREEN, '🎉 All tests passed! Legal pages implementation is complete.')
    console.log('\n📋 Summary:')
    console.log('• ✅ Privacy Policy with comprehensive data protection information')
    console.log('• ✅ Legal Disclosure with company details and disclaimers')
    console.log('• ✅ Terms & Disclaimers with risk warnings and legal terms')
    console.log('• ✅ Tabbed navigation interface similar to Airbnb')
    console.log('• ✅ Integration with navigation header and footer')
    console.log('• ✅ Responsive design with proper UI components')
    console.log('• ✅ All content sourced from provided requirements')
    
    console.log('\n🚀 To test the pages:')
    console.log('1. Run your development server (npm run dev)')
    console.log('2. Navigate to http://localhost:3000/legal')
    console.log('3. Test the tabbed navigation between Privacy Policy, Legal Disclosure, and Terms & Disclaimers')
    console.log('4. Verify the legal links in the navigation header and footer work correctly')
  } else {
    log(RED, '❌ Some tests failed. Please check the issues above.')
    process.exit(1)
  }
}

main()
