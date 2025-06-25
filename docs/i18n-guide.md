# Internationalization (i18n) Guide

## Overview
This guide covers the internationalization system implemented in the Spora One Trust Investor Portal, providing multi-language support with a focus on scalability, performance, and user experience.

## Architecture

### i18n System Structure
```
lib/i18n/
├── context.tsx         # React context provider for i18n
├── translations.ts     # Translation dictionaries
└── types.ts           # TypeScript types for i18n (future)
```

### Core Components
1. **Translation Dictionary**: Centralized translation data
2. **Context Provider**: React context for translation access
3. **Translation Hook**: Custom hook for accessing translations
4. **Language Switcher**: UI component for language selection

## Translation Dictionary

### Structure (`/lib/i18n/translations.ts`)

```typescript
export const translations = {
  en: {
    // Common translations used across the app
    common: {
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      firstName: "First name",
      lastName: "Last name",
      company: "Company",
      optional: "(optional)",
      loading: "Loading...",
      submit: "Submit",
      cancel: "Cancel",
      continue: "Continue",
      back: "Back",
      next: "Next",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      signOut: "Sign out",
      welcomeBack: "Welcome back",
    },

    // Navigation translations
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      help: "Help",
      support: "Support",
      investments: "Investments",
      documents: "Documents",
      security: "Security",
    },

    // Authentication flow translations
    auth: {
      signIn: "Sign in",
      signUp: "Sign up",
      signOut: "Sign out",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset password",
      createAccount: "Create account",
      welcomeBack: "Welcome back",
      signInToAccount: "Sign in to your investor account",
      createYourAccount: "Create your account",
      joinInvestorCommunity: "Join Spora One Trust's investor community",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      createStrongPassword: "Create a strong password",
      confirmYourPassword: "Confirm your password",
      agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      rememberMe: "Remember me",
      sendResetLink: "Send reset link",
      resetLinkSent: "Password reset link sent to your email",
      passwordResetSuccess: "Password reset successfully",
      invalidCredentials: "Invalid email or password",
      accountCreated: "Account created successfully",
    },

    // KYC (Know Your Customer) translations
    kyc: {
      title: "Identity Verification",
      subtitle: "Complete your KYC to start investing",
      uploadDocuments: "Upload Documents",
      documentTypes: {
        passport: "Passport",
        drivingLicense: "Driving License",
        nationalId: "National ID Card",
        utilityBill: "Utility Bill",
        bankStatement: "Bank Statement",
      },
      instructions: {
        front: "Upload the front side of your ID document",
        back: "Upload the back side of your ID document",
        selfie: "Upload a clear selfie photo",
        proofOfAddress: "Upload proof of address (utility bill or bank statement)",
      },
      status: {
        notSubmitted: "Documents not submitted",
        pending: "Under review",
        approved: "Approved",
        rejected: "Rejected",
      },
      requirements: {
        title: "Document Requirements",
        items: [
          "High-quality, clear images",
          "All corners of the document visible",
          "No glare or shadows",
          "Text must be readable",
          "Documents must be valid and not expired"
        ]
      },
      uploadSuccess: "Documents uploaded successfully",
      reviewTime: "Review typically takes 24-48 hours",
    },

    // Investment stage translations
    investment: {
      stages: {
        pendingKyc: "Pending KYC",
        kycApproved: "KYC Approved",
        investmentReady: "Investment Ready",
        invested: "Invested",
      },
      stepper: {
        createAccount: "Create Account",
        verifyIdentity: "Verify Identity",
        completeProfile: "Complete Profile",
        startInvesting: "Start Investing",
      },
      dashboard: {
        title: "Investment Dashboard",
        totalInvested: "Total Invested",
        currentValue: "Current Value",
        totalReturns: "Total Returns",
        portfolioPerformance: "Portfolio Performance",
      },
    },

    // Profile management translations
    profile: {
      title: "Profile Settings",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      securitySettings: "Security Settings",
      updateProfile: "Update Profile",
      profileUpdated: "Profile updated successfully",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      passwordChanged: "Password changed successfully",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      companyName: "Company Name",
      address: "Address",
      city: "City",
      country: "Country",
      postalCode: "Postal Code",
    },

    // Two-factor authentication translations
    twoFactor: {
      title: "Two-Factor Authentication",
      subtitle: "Add an extra layer of security to your account",
      enable: "Enable 2FA",
      disable: "Disable 2FA",
      status: {
        enabled: "2FA is enabled",
        disabled: "2FA is disabled",
      },
      setup: {
        step1: "Scan QR code with your authenticator app",
        step2: "Enter the 6-digit code from your app",
        step3: "Save your recovery codes safely",
      },
      enterCode: "Enter 6-digit code",
      invalidCode: "Invalid code. Please try again.",
      setupComplete: "Two-factor authentication enabled successfully",
      recoveryCodes: "Recovery Codes",
      recoveryCodesNote: "Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.",
      generateNewCodes: "Generate New Codes",
    },

    // Error messages
    errors: {
      generic: "An error occurred. Please try again.",
      networkError: "Network error. Please check your connection.",
      validationError: "Please correct the errors below.",
      unauthorized: "You are not authorized to perform this action.",
      forbidden: "Access denied.",
      notFound: "Page not found.",
      serverError: "Server error. Please try again later.",
      pageNotFound: "The page you're looking for doesn't exist.",
      sessionExpired: "Your session has expired. Please sign in again.",
      
      // Field validation errors
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      passwordTooShort: "Password must be at least 8 characters",
      passwordsNotMatch: "Passwords do not match",
      invalidPhoneNumber: "Please enter a valid phone number",
      
      // File upload errors
      fileTooLarge: "File size is too large. Maximum size is 10MB.",
      invalidFileType: "Invalid file type. Please upload a valid image.",
      uploadFailed: "File upload failed. Please try again.",
    },

    // Success messages
    success: {
      profileUpdated: "Profile updated successfully",
      passwordChanged: "Password changed successfully",
      emailSent: "Email sent successfully",
      documentUploaded: "Document uploaded successfully",
      settingsSaved: "Settings saved successfully",
    },

    // Loading states
    loading: {
      signingIn: "Signing in...",
      signingUp: "Creating account...",
      uploading: "Uploading...",
      processing: "Processing...",
      saving: "Saving...",
      loading: "Loading...",
      verifying: "Verifying...",
    },

    // Footer translations
    footer: {
      company: "Spora One Trust",
      tagline: "Empowering your financial future",
      links: {
        about: "About Us",
        contact: "Contact",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        support: "Support",
        careers: "Careers",
      },
      copyright: "© 2024 Spora One Trust. All rights reserved.",
      followUs: "Follow us",
    },

    // Date and time formatting
    dateTime: {
      formats: {
        short: "MMM d, yyyy",
        long: "MMMM d, yyyy",
        withTime: "MMM d, yyyy 'at' h:mm a",
      },
      relative: {
        justNow: "Just now",
        minutesAgo: "{count} minutes ago",
        hoursAgo: "{count} hours ago",
        daysAgo: "{count} days ago",
        weeksAgo: "{count} weeks ago",
        monthsAgo: "{count} months ago",
      },
    },
  },
  
  // Future language support
  // es: { /* Spanish translations */ },
  // fr: { /* French translations */ },
  // de: { /* German translations */ },
} as const;

// Type for available languages
export type Language = keyof typeof translations;

// Type for translation keys (for type safety)
export type TranslationKey = keyof typeof translations.en;

// Helper type for nested translation keys
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationPath = NestedKeyOf<typeof translations.en>;
```

## Context Provider

### Implementation (`/lib/i18n/context.tsx`)

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationPath } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationPath, params?: Record<string, string | number>) => string;
  availableLanguages: Language[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ 
  children, 
  defaultLanguage = 'en' 
}: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function with interpolation support
  const t = (key: TranslationPath, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k];
    }

    // Return key if translation not found (fallback)
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Replace parameters in translation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const availableLanguages: Language[] = Object.keys(translations) as Language[];

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

// Custom hook to use i18n context
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Alternative hook with shorter name
export const useI18n = useTranslation;
```

## Language Switcher Component

### Implementation (`/components/language-switcher.tsx`)

```typescript
'use client';

import { useTranslation } from '@/lib/i18n/context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
} as const;

const languageFlags = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
} as const;

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useTranslation();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[160px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            <div className="flex items-center gap-2">
              <span>{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

## Usage Examples

### Basic Translation Usage

```typescript
import { useTranslation } from '@/lib/i18n/context';

function SignInPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('auth.signIn')}</h1>
      <p>{t('auth.signInToAccount')}</p>
      <button>{t('common.continue')}</button>
    </div>
  );
}
```

### Translation with Parameters

```typescript
function UserGreeting({ userName }: { userName: string }) {
  const { t } = useTranslation();

  return (
    <p>{t('common.welcome', { name: userName })}</p>
  );
}

// In translations.ts, add:
// welcome: "Welcome, {name}!"
```

### Pluralization Support

```typescript
function NotificationCount({ count }: { count: number }) {
  const { t } = useTranslation();

  // Simple pluralization
  const messageKey = count === 1 ? 'notification.single' : 'notification.multiple';
  
  return (
    <span>{t(messageKey, { count })}</span>
  );
}

// In translations.ts:
// notification: {
//   single: "You have {count} notification",
//   multiple: "You have {count} notifications"
// }
```

### Form Validation with i18n

```typescript
import { useTranslation } from '@/lib/i18n/context';
import { z } from 'zod';

function useValidationSchema() {
  const { t } = useTranslation();

  return z.object({
    email: z
      .string()
      .min(1, t('errors.required'))
      .email(t('errors.invalidEmail')),
    password: z
      .string()
      .min(8, t('errors.passwordTooShort')),
  });
}
```

### Dynamic Language Loading (Future Enhancement)

```typescript
// lib/i18n/loader.ts
export async function loadLanguage(language: string) {
  try {
    const translations = await import(`./translations/${language}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load language: ${language}`, error);
    return null;
  }
}

// Usage in context
const loadAndSetLanguage = async (lang: Language) => {
  const translations = await loadLanguage(lang);
  if (translations) {
    // Update translations dynamically
    setLanguage(lang);
  }
};
```

## Best Practices

### Translation Key Organization

```typescript
// ✅ Good: Organized by feature/section
auth: {
  signIn: "Sign in",
  signUp: "Sign up",
  forgotPassword: "Forgot password?"
}

// ❌ Avoid: Flat structure
signIn: "Sign in",
signUp: "Sign up",
forgotPassword: "Forgot password?"
```

### Consistent Naming

```typescript
// ✅ Good: Consistent naming pattern
buttons: {
  submit: "Submit",
  cancel: "Cancel",
  save: "Save"
}

// ❌ Avoid: Inconsistent naming
submitButton: "Submit",
cancelBtn: "Cancel",
saveAction: "Save"
```

### Parameter Usage

```typescript
// ✅ Good: Clear parameter names
welcome: "Welcome back, {userName}!"
itemCount: "You have {count} items in your cart"

// ❌ Avoid: Unclear parameters
welcome: "Welcome back, {0}!"
itemCount: "You have {x} items in your cart"
```

## Performance Considerations

### Lazy Loading Translations

```typescript
// Future enhancement: Code splitting by language
const loadTranslations = async (language: string) => {
  const module = await import(`./translations/${language}`);
  return module.default;
};
```

### Memoization

```typescript
// Memoize translation function for better performance
const t = useMemo(() => {
  return (key: TranslationPath, params?: Record<string, string | number>) => {
    // Translation logic
  };
}, [language]);
```

## Testing i18n

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n/context';
import SignInPage from './signin';

describe('SignInPage i18n', () => {
  it('renders in English by default', () => {
    render(
      <I18nProvider>
        <SignInPage />
      </I18nProvider>
    );
    
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders in Spanish when language is set', () => {
    render(
      <I18nProvider defaultLanguage="es">
        <SignInPage />
      </I18nProvider>
    );
    
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });
});
```

## Future Enhancements

### RTL Language Support

```typescript
// Add RTL language detection
const isRTL = ['ar', 'he', 'fa'].includes(language);

// Apply RTL styles
<div dir={isRTL ? 'rtl' : 'ltr'}>
  {children}
</div>
```

### Locale-specific Formatting

```typescript
// Date formatting by locale
const formatDate = (date: Date, language: string) => {
  return new Intl.DateTimeFormat(language).format(date);
};

// Number formatting by locale
const formatCurrency = (amount: number, language: string) => {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
```

### Translation Management

```typescript
// Future: Integration with translation management services
// - Crowdin
// - Lokalise
// - Phrase
// - Transifex
```

## Deployment Considerations

### Build-time Translation Validation

```typescript
// Script to validate all translation keys exist
const validateTranslations = () => {
  const languages = Object.keys(translations);
  const baseKeys = extractAllKeys(translations.en);
  
  languages.forEach(lang => {
    const langKeys = extractAllKeys(translations[lang]);
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length > 0) {
      console.error(`Missing translations in ${lang}:`, missingKeys);
    }
  });
};
```

### SEO Considerations

```typescript
// Set language meta tags
<html lang={language}>
  <head>
    <meta property="og:locale" content={language} />
    <link rel="alternate" hrefLang="en" href="/en" />
    <link rel="alternate" hrefLang="es" href="/es" />
  </head>
</html>
```

This i18n system provides a solid foundation for multi-language support while maintaining type safety and performance.
