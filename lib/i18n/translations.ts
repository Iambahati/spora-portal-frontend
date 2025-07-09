import { error } from "console"
import { act } from "react"

export const translations = {
  en: {
    // Common
    common: {
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      firstName: "First name",
      lastName: "Last name",
      fullName: "Full name",
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
      disabling: "Disabling...",
      enabled: "Enabled",
      disabled: "Disabled",
      settingUp: "Setting up...",
      confirming: "Confirming",
      revoking: "Revoking...",
      refreshing: "Refreshing...",
      submitting: "Submitting...",
      goHome: "Go Home",
      goBack: "Go Back",
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      help: "Help",
      governance: "Governance",
      shares: "Shares",
      investment: "Investments",
      aboutUs: "About Us",
      legal: "Legal",
    },

    sidenav: {
      home: 'Home',
      profile: "Profile Settings",
      investments: 'Investments',
      shares: "Shares",
      aboutUs: "About Us",
      notifications: "Notifications",
      support: "Support",
    },

    // Authentication
    auth: {
      signIn: "Sign in",
      signUp: "Sign up",
      signOut: "Sign out",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset password",
      createAccount: "Create account",
      welcomeBack: "Welcome back",
      signInToAccount: "Sign in to access your investment dashboard",
      createYourAccount: "Create your account",
      joinInvestorCommunity: "Start your investment journey today",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      createStrongPassword: "Create a strong password",
      confirmYourPassword: "Confirm your password",
      rememberMe: "Remember me",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      agreeToTerms: "I agree to the",
      termsOfService: "Terms of Service",
      and: "and",
      privacyPolicy: "Privacy Policy",
      securityEncryption: "Secured with 256-bit SSL encryption",
      bankLevelSecurity: "Your data is protected with bank-level security",
      sendResetLink: "Send Password Reset Link",
      SendingResetLink: "Sending Password Reset Link...",

      // Forgot Password
      forgotPasswordTitle: "Forgot password?",
      forgotPasswordSubtitle: "Enter your email, we'll send you a reset link",
      sendResetInstructions: "Send reset instructions",
      checkYourEmail: "Check your email",
      resetLinkSent: "We've sent a password reset link to your email",
      resetLinkSentTo: "We've sent a password reset link to",
      didntReceiveEmail: "Didn't receive the email? Check your spam folder or try again.",
      tryDifferentEmail: "Try different email",
      backToSignIn: "Back to sign in",
      securePasswordReset: "Secure password reset process",

      // Reset Password
      setNewPassword: "Reset Your Password",
      resetPasswordDescription: " Enter your new password to secure your account",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New password",
      enterNewPassword: "Enter new password",
      passwordRequirements: "Password requirements:",
      atLeast8Characters: "At least 8 characters long",
      uppercaseLowercase: "Contains uppercase and lowercase letters",
      atLeastOneNumber: "Contains at least one number",
      atLeastOneSpecial: "Contains at least one special character",
      updatePassword: "Update password",
      updatingPassword: "Updating password...",
      passwordResetSuccessful: "Password reset successful",
      passwordUpdatedSuccessfully: "Your password has been updated successfully",
      signInWithNewPassword: "You can now sign in with your new password.",
      invalidResetLink: " Invalid Reset Link",
      invalidResetLinkMessage: "This password reset link is invalid or has expired.",
      requestNewResetLink: "Request new reset link",
      continueToSignIn: "Continue to sign in",
      passwordTooWeak: "Password is too weak. Use at least 8 characters, uppercase, lowercase, number, and symbol.",
      passwordGood: "Good",
      passwordStrong: "Strong",
      passwordWeak: "Weak",

      // Account Activation
      activateAccount: "Activate Account",
      activateAccountSubtitle: "Set your password to complete activation",
      activatingAccount: "Activating account...",
      activationSuccessful: "Account activated successfully",
      activationFailed: "Activation failed",
      invalidActivationLink: "Invalid or expired activation link",
      resendActivationEmail: "Resend activation email",
      resendingActivationEmail: "Resending activation email...",
      activationEmailSent: "Activation email sent successfully",
      checkEmailForActivation: "Please check your email for the activation link",
      settingPassword: "Setting password...",
      passwordSetSuccessfully: "Password set successfully",
      accountReadyToUse: "Your account is now ready to use",

      // Errors
      passwordsDoNotMatch: "Passwords do not match",
      agreeToTermsRequired: "Please agree to the terms and conditions",
      passwordTooShort: "Password must be at least 8 characters long",
      signInFailed: "Sign in failed",
      registrationFailed: "Registration failed",
      resetEmailFailed: "Failed to send reset email",
      passwordResetFailed: "Password reset failed",
      errorOccurred: "An error occurred",

      // Success
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      sending: "Sending...",
    },

    errors: {
      pageNotFound: "Page Not Found",
      pageNotFoundDescription: "The page you are looking for does not exist.",
    },

    // Loading states
    loading: {
      signingIn: "Signing in...",
      signingUp: "Creating account...",
      sending: "Sending...",
      loading: "Loading...",
      processing: "Processing...",
      saving: "Saving...",
      uploading: "Uploading...",
      verifying: "Verifying...",
      submitting: "Submitting...",
    },

    // Brand
    brand: {
      name: "Spora One Trust",
      tagline: "Dream it. Achieve it.",
      description: "Your trusted partner in building wealth and securing your financial future.",
      copyright: "© 2024 Spora One Trust. All rights reserved.",
    },

    profileTab: {
      profile: "Profile",
      twofa: "Two-Factor Authentication",
      deviceSessions: "Device Sessions",
    },

    profile: {
      accountSettings: "Account Settings",
      manageProfile: "Manage your profile and security settings",
      fullName: "Full Name",
      email: "Email Address",
      changePassword: "Change Password",
      savingChanges: "Saving changes...",
      saveChanges: "Save Changes",
    },

    twofa: {
      twofaAuthentication: "Two-Factor Authentication",
      enable2FA: "Enable 2FA",
      scanQRCode: "Scan QR Code",
      scanQRCodeDesc: "Scan this QR code with your authenticator app, then enter the 6-digit code below.",
      manualEntry: "Manual Entry Key",
      confirmationCode: "Confirmation Code",
      confirmAndEnable: "Confirm & Enable",
      recoveryCodes: "Recovery Codes",
      recoveryCodesDesc: "Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.",
      savedMyRecoveryCodes: "I've Saved My Recovery Codes",
      disable2FATitle: "Disable Two-Factor Authentication",
      disable2FADesc: "Enter your password to disable two-factor authentication.",
      disable2FA: "Disable 2FA",
    },

    session: {
      activeSession: "Active Sessions",
      activeSessionsDesc: "Manage your active sessions across all devices",
      revokeAll: "Revoke All",
      currentSession: "Current Session",
      lastUsed: "Last used",
      noActiveSessions: "No active sessions found.",
      refreshSessions: "Refresh Sessions",
    },

    // NDA (Non-Disclosure Agreement)
    nda: {
      title: "Non-Disclosure Agreement",
      subtitle: "Please review and accept the NDA to continue with your investment process",
      documentContent: "Document Content",
      readingProgress: "Reading Progress",
      timeReading: "Time reading:",
      minimum: "Minimum:",
      readingRequirements: "Reading Requirements",
      readingRequirementsDesc: "Please complete all requirements below before you can accept the NDA",
      comprehensionConfirmation: "Comprehension Confirmation",
      comprehensionConfirmationDesc: "Please confirm your understanding by checking all boxes below",
      
      // Reading requirements
      readEntireDocument: "Read the entire document (scroll to bottom)",
      spendMinimumTime: "Spend at least {time} seconds reading ({elapsed}s elapsed)",
      
      // Comprehension checks
      understoodConfidentiality: "I understand that I must keep all information shared by Spora One Trust strictly confidential and not disclose it to any third parties.",
      understoodConsequences: "I understand the legal consequences of breaching this NDA and that Spora One Trust may seek injunctive relief and damages.",
      confirmedIdentity: "I confirm that I am {name} and I have the authority to enter into this agreement on my behalf.",
      
      // Actions
      acceptNDA: "Accept NDA and Continue",
      declineNDA: "Decline NDA",
      downloadPDF: "Download PDF",
      reviewAgain: "Review Again",
      
      // Status messages
      ndaAccepted: "NDA Accepted",
      ndaDeclined: "NDA Declined",
      ndaAcceptedMessage: "You have successfully accepted the NDA and can now proceed with the investment process.",
      ndaDeclinedMessage: "You have declined the Non-Disclosure Agreement. Unfortunately, you cannot proceed with the investment process without accepting the NDA.",
      ndaDeclinedHelp: "To continue with your investment journey, you must accept the NDA. Please review the document again and contact support if you have any questions.",
      
      // Warnings and notices
      importantNotice: "By accepting this NDA, you agree to keep all shared information confidential. Declining this agreement will prevent you from proceeding with the investment process.",
      requirementsNotMet: "Requirements not met: Please complete all reading requirements and comprehension checks above before you can accept the NDA.",
      mustScrollToBottom: "Please read the entire document carefully. You must scroll to the bottom to continue.",
      
      // Help
      haveQuestions: "Have questions about this agreement? Contact our support team for assistance.",
      contactSupport: "Contact Support",
      
      // Loading
      loadingDocument: "Loading NDA document...",
      processing: "Processing...",
    },

    // KYC
    kyc: {
      title: "KYC Document Verification",
      subtitle: "Please upload the required documents to complete your KYC verification process.",
      selectDocumentType: "Select any one type of government-issued identification document",
      driversLicenseOrId: "National ID Card or Driver's License",
      kenyanPassport: "Valid Passport",
      idFront: "ID Front",
      idBack: "ID Back",
      uploadFrontSide: "Upload the front side of your ID",
      uploadBackSide: "Upload the back side of your ID",
      passportFirstPage: "Passport First Page",
      passportLastPage: "Passport Last Page",
      uploadFirstPage: "Upload the first page of your passport",
      uploadLastPage: "Upload the last page of your passport",
      passportStylePhoto: "Passport-Style Photo",
      uploadPassportPhoto: "Upload a recent passport-style photograph",
      documentsUploadedSuccessfully: "Documents uploaded successfully!",
      submitDocuments: "Submit Documents",
      

      // File Upload
      dragDropFile: "Drag and drop your file here, or click to browse",
      maxFileSize: "Max file size:",
      uploadComplete: "Upload complete",
      uploading: "Uploading...",

      // Errors
      idFrontRequired: "ID front photo is required",
      idBackRequired: "ID back photo is required",
      passportFirstRequired: "Passport first page is required",
      passportLastRequired: "Passport last page is required",
      passportPhotoRequired: "Passport-style photo is required",
      submissionFailed: "Submission failed. Please try again.",
      fileSizeTooLarge: "File size must be less than",
      invalidFileType: "Invalid file type",
      
    },

    // Investment Portal
    portal: {
      title: "Spora One Trust Investor Portal",
      welcomeBack: "Welcome back",
      logout: "Logout",
      investmentJourney: "Investment Journey",
      kycVerification: "KYC Verification",
      investmentPlanning: "Investment Planning",
      investmentStatus: "Investment Status",
      trackInvestmentStatus: "Track your investment status and next steps.",
      currentStatus: "Current Status:",
      pendingKyc: "Pending KYC",
      completeKyc: "Complete KYC Verification",
      completeKycVerification:
        "Complete your KYC verification to proceed to the next stage of your investment journey.",
      kycDescription: "Please provide the required documents for identity verification.",
      planInvestment: "Plan Your Investment",
      investmentDescription: "Set up your investment plan and goals.",

      // Success Splash
      kycVerificationInitiated: "KYC Verification Initiated",
      processingTime: "Processing Time: 3-4 Business Days",
      kycInitiatedDescription:
        "Your KYC verification process has been successfully initiated. Our compliance team will review your submitted documents within the next 3-4 business days.",
      emailNotification: "You'll receive an email notification once the verification is complete",
      whatHappensNext: "What happens next?",
      documentVerification: "Document verification and compliance review",
      emailNotificationCompletion: "Email notification upon completion",
      accessNextStage: "Access to the next investment stage",
    },

    // Investment Stages
    stages: {
      pendingKyc: "Pending KYC",
      pendingKycDesc: "Document verification in progress",
      kycApproved: "KYC Approved",
      kycApprovedDesc: "Identity verified successfully",
      agreementSigned: "Agreement Signed",
      agreementSignedDesc: "Investment agreement completed",
      paymentPending: "Payment Pending",
      paymentPendingDesc: "Awaiting investment payment",
      paymentConfirmed: "Payment Confirmed",
      paymentConfirmedDesc: "Payment received and verified",
      certificateIssued: "Certificate Issued",
      certificateIssuedDesc: "Share certificate generated",
      activeShareholder: "Active Shareholder",
      activeShareholderDesc: "Investment active and earning",
      inactive: "Inactive",
      inactiveDesc: "Investment temporarily inactive",
      onHold: "On Hold",
      onHoldDesc: "Investment status under review",
      estimated: "Estimated:",
      businessDays: "business days",
    },

    // About Us page
    aboutUs: {
      title: "About Spora One Trust",
      subtitle: "Empowering the global diaspora through trusted, innovative financial solutions",
      tabs: {
        governance: "Governance",
        mission: "Mission", 
        funds: "Fund Allocation",
        team: "Team"
      },
      governance: {
        title: "Our Governance Framework",
        ownership: {
          title: "Ownership Structure",
          owner: "Owner: Spora One Trust Inc. - specifically designed for Diaspora-led governance",
          subsidiary: "Subsidiary: A licensed commercial bank in Kenya"
        },
        board: {
          title: "Board Structure", 
          description: "Comprised of Diaspora-nominated fiduciaries, financial experts, and legal counsel ensuring community representation"
        },
        oversight: {
          title: "Oversight Bodies",
          trustees: "Trustees",
          audit: "Audit Committee", 
          investment: "Investment Committee",
          diaspora: "Diaspora Council"
        },
        regulatory: {
          title: "Regulatory Oversight",
          description: "Overseen by the Central Bank of Kenya, and relevant financial authorities in the US, UK, and Canada as applicable"
        },
        transparency: {
          title: "Audit & Transparency",
          description: "We commit to independent annual audits, transparent shareholder reports, and regular diaspora town halls to ensure accountability and trust"
        }
      },
      mission: {
        title: "Our Purpose: Empowering the Global Diaspora",
        description: "To empower Sub-Saharan's abroad by providing secure, trusted, innovative, inclusive and accessible financial solutions",
        subtitle: "These solutions are designed to build wealth, strengthen community ties, and foster economic growth in the region, all while enhancing financial inclusion for diaspora communities worldwide",
        pillars: {
          wealth: {
            title: "Build Wealth",
            description: "Innovative investment opportunities and savings solutions designed for diaspora communities"
          },
          community: {
            title: "Strengthen Communities", 
            description: "Foster connections and collaboration among diaspora communities worldwide"
          },
          growth: {
            title: "Economic Growth",
            description: "Drive sustainable economic development across Sub-Saharan Africa"
          }
        }
      },
      funds: {
        title: "Strategic Allocation of Capital",
        goal: "Total Fundraising Goal: USD 70–120 million",
        distribution: "Fund Distribution",
        breakdown: "Detailed Breakdown",
        allocation: {
          bankAcquisition: {
            label: "Bank Acquisition",
            description: "Acquisition of licensed commercial banking operations in Kenya"
          },
          capitalReserve: {
            label: "Capital Reserve Buffer",
            description: "Regulatory capital requirements and financial stability reserves"
          },
          technology: {
            label: "Technology & Infrastructure", 
            description: "Banking technology platform, security systems, and digital infrastructure"
          },
          regulatory: {
            label: "Regulatory & Legal",
            description: "Compliance, licensing, legal framework, and regulatory requirements"
          },
          operations: {
            label: "Operations & Staffing",
            description: "Personnel, operational expenses, and day-to-day banking operations"
          },
          contingency: {
            label: "Contingency & Working Capital",
            description: "Emergency reserves and operational working capital"
          },
          marketing: {
            label: "Marketing & Engagement",
            description: "Diaspora outreach, marketing campaigns, and community engagement"
          },
          governance: {
            label: "Governance & Legal",
            description: "Corporate governance structure, legal entity setup, and oversight systems"
          }
        }
      },
      team: {
        title: "The Visionaries Behind Spora One Trust",
        description: "Our founding team comprises distinguished professionals known for visionary leadership, strategic innovation, and deep commitment to diaspora-focused financial services",
        experience: "Experience",
        highlights: "Key Highlights:",
        vision: {
          title: "Our Collective Vision",
          description: "The founders of Spora One Trust are committed to establishing a licensed diaspora bank that connects Kenyan communities worldwide through accessible, secure, and innovative financial solutions. Guided by principles of ethical governance, economic empowerment, and strategic global partnerships, they aim to foster sustainable growth, financial inclusion, and intergenerational wealth-building opportunities for Kenyans at home and abroad. Together, they embody a legacy of transforming capital into community progress."
        }
      },
      cta: {
        title: "Ready to Join Our Mission?",
        subtitle: "Be part of the financial revolution that empowers diaspora communities worldwide",
        invest: "Start Investing",
        learn: "Learn More"
      }
    },

    // Footer
    footer: {
      company: {
        name: "Spora One Trust",
        description: "Empowering diaspora communities worldwide with innovative financial solutions and investment opportunities.",
        address: "Nairobi, Kenya & Global Diaspora Centers"
      },
      quickLinks: {
        title: "Quick Links",
        aboutUs: "About Us",
        dashboard: "Dashboard",
        kycPortal: "KYC Portal",
        settings: "Settings"
      },
      legal: {
        title: "Legal & Support",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        nda: "NDA Agreement",
        support: "Support Center"
      },
      social: {
        followUs: "Follow Us"
      },
      copyright: "Spora One Trust. All rights reserved."
    },
  },

  sw: {
    // Common
    common: {
      email: "Barua pepe",
      password: "Nenosiri",
      confirmPassword: "Thibitisha nenosiri",
      firstName: "Jina la kwanza",
      lastName: "Jina la mwisho",
      fullName: "Jina kamili",
      company: "Kampuni",
      optional: "(hiari)",
      loading: "Inapakia...",
      submit: "Wasilisha",
      cancel: "Ghairi",
      continue: "Endelea",
      back: "Rudi",
      next: "Ifuatayo",
      save: "Hifadhi",
      edit: "Hariri",
      delete: "Futa",
      close: "Funga",
      signOut: "Ondoka",
    },

    // Navigation
    nav: {
      home: "Nyumbani",
      dashboard: "Dashibodi",
      profile: "Profaili",
      settings: "Mipangilio",
      help: "Msaada",
      support: "Usaidizi",
    },

    // Authentication
    auth: {
      signIn: "Ingia",
      signUp: "Jisajili",
      signOut: "Ondoka",
      forgotPassword: "Umesahau nenosiri?",
      resetPassword: "Weka upya nenosiri",
      createAccount: "Fungua akaunti",
      welcomeBack: "Karibu tena",
      signInToAccount: "Ingia ili upate dashibodi yako ya uwekezaji",
      createYourAccount: "Fungua akaunti yako",
      joinInvestorCommunity: "Anza safari yako ya uwekezaji leo",
      enterEmail: "Ingiza barua pepe yako",
      enterPassword: "Ingiza nenosiri lako",
      createStrongPassword: "Tengeneza nenosiri thabiti",
      confirmYourPassword: "Thibitisha nenosiri lako",
      rememberMe: "Nikumbuke",
      dontHaveAccount: "Huna akaunti?",
      alreadyHaveAccount: "Tayari una akaunti?",
      agreeToTerms: "Nakubali",
      termsOfService: "Masharti ya Huduma",
      and: "na",
      privacyPolicy: "Sera ya Faragha",
      securityEncryption: "Imelindwa na usimbaji wa 256-bit SSL",
      bankLevelSecurity: "Data yako inalindwa kwa usalama wa kiwango cha benki",
      sendResetLink: "Tuma kiungo cha kuweka upya",
      SendingResetLink: "Inatuma kiungo cha kuweka upya nenosiri...",

      // Forgot Password
      forgotPasswordTitle: "Umesahau nenosiri?",
      forgotPasswordSubtitle: "Usijali, tutakutumia maagizo ya kuweka upya",
      sendResetInstructions: "Tuma maagizo ya kuweka upya",
      checkYourEmail: "Angalia barua pepe yako",
      resetLinkSent: "Tumekutumia kiungo cha kuweka upya nenosiri kwenye barua pepe yako",
      resetLinkSentTo: "Tumekutumia kiungo cha kuweka upya nenosiri kwa",
      didntReceiveEmail: "Hukupokea barua pepe? Angalia folda yako ya spamu au jaribu tena.",
      tryDifferentEmail: "Jaribu barua pepe tofauti",
      backToSignIn: "Rudi kwenye kuingia",
      securePasswordReset: "Mchakato salama wa kuweka upya nenosiri",

      // Reset Password
      setNewPassword: "Weka nenosiri jipya",
      chooseStrongPassword: "Chagua nenosiri thabiti kwa akaunti yako",
      newPassword: "Nenosiri jipya",
      confirmNewPassword: "Thibitisha nenosiri jipya",
      enterNewPassword: "Ingiza nenosiri jipya",
      passwordRequirements: "Mahitaji ya nenosiri:",
      atLeast8Characters: "Angalau herufi 8 za urefu",
      uppercaseLowercase: "Ina herufi za juu na za chini",
      atLeastOneNumber: "Ina angalau nambari moja",
      atLeastOneSpecial: "Ina angalau herufi moja ya pekee",
      updatePassword: "Sasisha nenosiri",
      updatingPassword: "Inasasisha nenosiri...",
      passwordResetSuccessful: "Kuweka upya nenosiri kumefanikiwa",
      passwordUpdatedSuccessfully: "Nenosiri lako limesasishwa kwa mafanikio",
      signInWithNewPassword: "Sasa unaweza kuingia na nenosiri lako jipya.",
      continueToSignIn: "Endelea kuingia",
      accountNowSecure: "Akaunti yako sasa iko salama",

      // Account Activation
      activateAccount: "Activate Account",
      activateAccountSubtitle: "Set your password to complete activation",
      activatingAccount: "Activating account...",
      activationSuccessful: "Account activated successfully",
      activationFailed: "Activation failed",
      invalidActivationLink: "Invalid or expired activation link",
      resendActivationEmail: "Resend activation email",
      resendingActivationEmail: "Resending activation email...",
      activationEmailSent: "Activation email sent successfully",
      checkEmailForActivation: "Please check your email for the activation link",
      settingPassword: "Setting password...",
      passwordSetSuccessfully: "Password set successfully",
      accountReadyToUse: "Your account is now ready to use",

      // Errors
      passwordsDoNotMatch: "Manenosiri hayalingani",
      agreeToTermsRequired: "Tafadhali kubali masharti na sheria",
      passwordTooShort: "Nenosiri lazima liwe na angalau herufi 8 za urefu",
      signInFailed: "Kuingia kumeshindwa",
      registrationFailed: "Usajili umeshindwa",
      resetEmailFailed: "Imeshindwa kutuma barua pepe ya kuweka upya",
      passwordResetFailed: "Kuweka upya nenosiri kumeshindwa",
      errorOccurred: "Hitilafu imetokea",

      // Success
      signingIn: "Inaingia...",
      creatingAccount: "Inafungua akaunti...",
      sending: "Inatuma...",
    },

    // Loading states
    loading: {
      signingIn: "Inaingia...",
      signingUp: "Inafungua akaunti...",
      sending: "Inatuma...",
      loading: "Inapakia...",
      processing: "Inachakata...",
      saving: "Inahifadhi...",
      uploading: "Inapakia...",
      verifying: "Inathibitisha...",
      submitting: "Inawasilisha...",
    },

    // Brand
    brand: {
      name: "Spora One Trust",
      tagline: "Iota. Ifanikishe.",
      description: "Mshirika wako wa kuaminika katika kujenga utajiri na kulinda mustakabali wako wa kifedha.",
      copyright: "© 2024 Spora One Trust. Haki zote zimehifadhiwa.",
    },

    // KYC
    kyc: {
      title: "Uthibitishaji wa Hati za KYC",
      subtitle: "Tafadhali pakia hati zinazohitajika ili kukamilisha mchakato wako wa uthibitishaji wa KYC.",
      selectDocumentType: "Chagua Aina ya Hati",
      driversLicenseOrId: "Leseni ya Udereva au Kitambulisho cha Taifa",
      kenyanPassport: "Pasipoti ya Kenya",
      idFront: "Mbele ya Kitambulisho",
      idBack: "Nyuma ya Kitambulisho",
      uploadFrontSide: "Pakia upande wa mbele wa kitambulisho chako",
      uploadBackSide: "Pakia upande wa nyuma wa kitambulisho chako",
      passportFirstPage: "Ukurasa wa Kwanza wa Pasipoti",
      passportLastPage: "Ukurasa wa Mwisho wa Pasipoti",
      uploadFirstPage: "Pakia ukurasa wa kwanza wa pasipoti yako",
      uploadLastPage: "Pakia ukurasa wa mwisho wa pasipoti yako",
      passportStylePhoto: "Picha ya Mtindo wa Pasipoti",
      uploadPassportPhoto: "Pakia picha ya hivi karibuni ya mtindo wa pasipoti",
      documentsUploadedSuccessfully: "Hati zimepakiwa kwa mafanikio!",
      submitKycDocuments: "Wasilisha Hati za KYC",
      submitting: "Inawasilisha...",

      // File Upload
      dragDropFile: "Buruta na udondoshe faili yako hapa, au bofya ili kuvinjari",
      maxFileSize: "Ukubwa wa juu wa faili:",
      uploadComplete: "Upakiaji umekamilika",
      uploading: "Inapakia...",

      // Errors
      idFrontRequired: "Picha ya mbele ya kitambulisho inahitajika",
      idBackRequired: "Picha ya nyuma ya kitambulisho inahitajika",
      passportFirstRequired: "Ukurasa wa kwanza wa pasipoti unahitajika",
      passportLastRequired: "Ukurasa wa mwisho wa pasipoti unahitajika",
      passportPhotoRequired: "Picha ya mtindo wa pasipoti inahitajika",
      submissionFailed: "Uwasilishaji umeshindwa. Tafadhali jaribu tena.",
      fileSizeTooLarge: "Ukubwa wa faili lazima uwe chini ya",
      invalidFileType: "Aina ya faili si sahihi",
    },

    // Investment Portal
    portal: {
      title: "Tovuti ya Wawekezaji ya Benki ya Baadaye",
      welcomeBack: "Karibu tena,",
      investmentJourney: "Safari ya Uwekezaji",
      kycVerification: "Uthibitishaji wa KYC",
      investmentStatus: "Hali ya Uwekezaji",
      trackInvestmentStatus: "Fuatilia hali yako ya uwekezaji na hatua za baadaye.",
      currentStatus: "Hali ya Sasa:",
      pendingKyc: "KYC Inasubiri",
      completeKycVerification: "Kamilisha uthibitishaji wako wa KYC ili kuendelea na hatua inayofuata ya safari yako ya uwekezaji.",

      // Success Splash
      kycVerificationInitiated: "Uthibitishaji wa KYC Umeanza",
      processingTime: "Muda wa Kuchakata: Siku za Biashara 3-4",
      kycInitiatedDescription: "Mchakato wako wa uthibitishaji wa KYC umeanza kwa mafanikio. Timu yetu ya kufuata sheria itapitia hati ulizowasilisha ndani ya siku 3-4 za biashara zinazofuata.",
      emailNotification: "Utapokea arifa ya barua pepe mara uthibitishaji utakapokamilika",
      whatHappensNext: "Nini kitafuata?",
      documentVerification: "Uthibitishaji wa hati na ukaguzi wa kufuata sheria",
      emailNotificationCompletion: "Arifa ya barua pepe baada ya kukamilika",
      accessNextStage: "Upatikanaji wa hatua inayofuata ya uwekezaji",
    },

    // Investment Stages
    stages: {
      pendingKyc: "KYC Inasubiri",
      pendingKycDesc: "Uthibitishaji wa hati unaendelea",
      kycApproved: "KYC Imeidhinishwa",
      kycApprovedDesc: "Utambulisho umethibitishwa kwa mafanikio",
      agreementSigned: "Mkataba Umesainiwa",
      agreementSignedDesc: "Mkataba wa uwekezaji umekamilika",
      paymentPending: "Malipo Yanasubiri",
      paymentPendingDesc: "Inasubiri malipo ya uwekezaji",
      paymentConfirmed: "Malipo Yamethibitishwa",
      paymentConfirmedDesc: "Malipo yamepokelewa na kuthibitishwa",
      certificateIssued: "Cheti Chimetolewa",
      certificateIssuedDesc: "Cheti cha hisa kimetolewa",
      activeShareholder: "Mwanahisa Amilifu",
      activeShareholderDesc: "Uwekezaji uko hai na unapata faida",
      inactive: "Haufanyi kazi",
      inactiveDesc: "Uwekezaji umesimamishwa kwa muda",
      onHold: "Imesimamishwa",
      onHoldDesc: "Hali ya uwekezaji iko chini ya ukaguzi",
      estimated: "Inakadiriwa:",
      businessDays: "siku za biashara",
    },
  },

}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
