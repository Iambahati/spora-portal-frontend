# Project Structure Documentation

## Overview
This document outlines the complete structure of the Spora One Trust Investor Portal frontend application, explaining the purpose and organization of each directory and file.

## Root Directory Structure

```
frontend/
├── .env.example                    # Environment variables template
├── .env.local                      # Local development environment
├── .gitignore                      # Git ignore patterns
├── .github/                        # GitHub configuration
│   └── copilot-instructions.md     # Copilot development guidelines
├── README.md                       # Project documentation
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.tsbuildinfo            # TypeScript incremental build info
├── next.config.mjs                 # Next.js configuration
├── next-env.d.ts                   # Next.js TypeScript declarations
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── components.json                 # Shadcn/ui components configuration
├── NEXFASTER_IMPLEMENTATION.md     # NexFaster pattern documentation
├── app/                            # Next.js App Router directory
├── components/                     # React components
├── hooks/                          # Custom React hooks
├── lib/                            # Utility libraries and configuration
├── router/                         # React Router application (NexFaster)
├── types/                          # TypeScript type definitions
├── public/                         # Static assets
├── styles/                         # Global styles
├── scripts/                        # Build and utility scripts
└── docs/                           # Documentation files
```

## Core Directories

### `/app` - Next.js App Router
Next.js 14 App Router structure implementing the NexFaster pattern.

```
app/
├── globals.css                     # Global CSS styles and Tailwind imports
├── layout.tsx                      # Root layout component
├── page.tsx                        # Landing/home page (redirects to shell)
└── shell/
    └── page.tsx                    # Shell page that loads React Router app
```

**Key Files:**
- `layout.tsx`: Root HTML layout with providers and metadata
- `shell/page.tsx`: Loads the React Router application with SSR disabled
- `globals.css`: Global styles, CSS variables, and Tailwind directives

### `/components` - React Components
Organized component library following atomic design principles.

```
components/
├── ui/                             # Base UI components (Shadcn/ui)
│   ├── accordion.tsx               # Collapsible content sections
│   ├── alert-dialog.tsx            # Modal confirmation dialogs
│   ├── alert.tsx                   # Notification banners
│   ├── avatar.tsx                  # User profile images
│   ├── badge.tsx                   # Status indicators
│   ├── button.tsx                  # Interactive buttons
│   ├── card.tsx                    # Content containers
│   ├── checkbox.tsx                # Form checkboxes
│   ├── dialog.tsx                  # Modal dialogs
│   ├── form.tsx                    # Form components with validation
│   ├── input.tsx                   # Text input fields
│   ├── label.tsx                   # Form labels
│   ├── select.tsx                  # Dropdown selectors
│   ├── tabs.tsx                    # Tabbed interfaces
│   ├── toast.tsx                   # Notification toasts
│   └── ...                        # Additional UI primitives
├── auth-layout.tsx                 # Authentication page layout
├── bank-loading.tsx                # Custom loading component
├── fast-link.tsx                   # Optimized navigation link
├── file-upload.tsx                 # File upload component
├── instant-navigation.tsx          # Navigation optimization
├── investment-stepper.tsx          # Multi-step investment process
├── kyc-form.tsx                    # KYC document upload form
├── language-switcher.tsx           # i18n language selector
├── optimized-suspense.tsx          # Performance-optimized Suspense
├── page-cache-provider.tsx         # Page caching provider
├── route-preloader.tsx             # Route preloading utility
├── success-splash.tsx              # Success confirmation screen
└── theme-provider.tsx              # Dark/light theme provider
```

**Component Categories:**
- **UI Components**: Base design system components from Shadcn/ui
- **Composite Components**: Business logic components specific to the application
- **Layout Components**: Page structure and navigation components
- **Utility Components**: Performance and optimization helpers

### `/hooks` - Custom React Hooks
Reusable logic encapsulated in custom hooks.

```
hooks/
├── use-fast-navigation.ts          # Fast navigation optimization
├── use-fast-router.ts              # Router performance optimization
├── use-mobile.tsx                  # Mobile device detection
└── use-toast.ts                    # Toast notification management
```

### `/lib` - Utility Libraries
Core utilities, configurations, and shared logic.

```
lib/
├── utils.ts                        # Common utility functions
├── performance-monitor.ts          # Performance tracking utilities
├── api-endpoints.md                # API documentation (legacy)
└── i18n/                           # Internationalization
    ├── context.tsx                 # i18n React context provider
    └── translations.ts             # Translation dictionaries
```

### `/router` - React Router Application (NexFaster)
Complete React Router application implementing the NexFaster pattern.

```
router/
├── app.tsx                         # Main React Router application
├── components/                     # Router-specific components
│   └── router-auth-layout.tsx      # Authentication layout for React Router
├── hooks/                          # Router-specific hooks
│   └── use-auth-check.ts           # Authentication state management
└── pages/                          # Page components
    ├── signin.tsx                  # Sign-in page
    ├── signup.tsx                  # Sign-up page
    ├── forgot-password.tsx         # Password reset request
    ├── reset-password.tsx          # Password reset form
    ├── kyc-portal.tsx              # KYC document portal
    └── not-found.tsx               # 404 error page
```

**Router Structure:**
- `app.tsx`: Main router configuration with route definitions
- `pages/`: Individual page components for each route
- `components/`: Components specific to the router application
- `hooks/`: Router-specific custom hooks

### `/types` - TypeScript Definitions
Global type definitions and interfaces.

```
types/
└── view-transitions.d.ts           # View Transitions API types
```

### `/public` - Static Assets
Static files served directly by the web server.

```
public/
├── favicon.ico                     # Website favicon
├── placeholder-logo.png            # Logo placeholder image
├── placeholder-logo.svg            # Logo placeholder vector
├── placeholder-user.jpg            # User avatar placeholder
├── placeholder.jpg                 # General placeholder image
├── placeholder.svg                 # General placeholder vector
└── images/                         # Additional images
    └── banking-hero.png            # Hero section image
```

### `/styles` - Stylesheets
Global styles and CSS configurations.

```
styles/
└── globals.css                     # Additional global styles
```

### `/scripts` - Build and Utility Scripts
Development and build automation scripts.

```
scripts/
└── test-router-performance.js      # Router performance testing
```

### `/docs` - Documentation
Comprehensive project documentation.

```
docs/
├── api-schema.md                   # API types and interfaces
├── deployment.md                   # Deployment instructions
├── project-structure.md            # This file
├── routing-guide.md                # Routing implementation guide
├── style-guide.md                  # Design system documentation
├── types-reference.md              # TypeScript usage guide
└── i18n-guide.md                   # Internationalization guide
```

## Configuration Files

### Package Management
- `package.json`: Dependencies, scripts, and project metadata
- `package-lock.json`: Exact dependency versions for reproducible builds

### TypeScript Configuration
- `tsconfig.json`: TypeScript compiler options and path mapping
- `next-env.d.ts`: Next.js TypeScript environment definitions

### Build Configuration
- `next.config.mjs`: Next.js configuration with NexFaster rewrites
- `postcss.config.mjs`: PostCSS plugins configuration
- `tailwind.config.ts`: Tailwind CSS theme and customization

### UI Components
- `components.json`: Shadcn/ui component configuration and paths

## Architecture Patterns

### NexFaster Pattern
The application implements the NexFaster pattern for optimal performance:

1. **Route Redirection**: All routes redirect to `/shell` via Next.js config
2. **Shell Loading**: `/app/shell/page.tsx` loads the React Router app
3. **Client-Side Routing**: React Router handles all navigation client-side
4. **Performance Optimization**: Route preloading, caching, and instant navigation

### Component Architecture
```
Pages (Route Components)
    ↓
Composite Components (Business Logic)
    ↓
UI Components (Design System)
    ↓
Base HTML Elements
```

### State Management
- **Local State**: React useState and useReducer
- **Global State**: React Context providers
- **Form State**: React Hook Form with Zod validation
- **API State**: Custom hooks with error handling

### Styling Architecture
```
Global Styles (globals.css)
    ↓
Tailwind Utilities
    ↓
CSS Custom Properties (Theme)
    ↓
Component-Specific Styles
```

## File Naming Conventions

### Components
- **React Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **UI Components**: `kebab-case.tsx` (e.g., `button.tsx`)
- **Page Components**: `kebab-case.tsx` (e.g., `signin.tsx`)

### Utilities and Hooks
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `api-client.ts`)
- **Types**: `kebab-case.d.ts` (e.g., `api-types.d.ts`)

### Assets
- **Images**: `kebab-case.{jpg,png,svg}` (e.g., `hero-image.jpg`)
- **Icons**: `kebab-case.svg` (e.g., `user-icon.svg`)

## Import Path Resolution

TypeScript path mapping in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

## Environment-Based Structure

### Development
- Source files in TypeScript/TSX
- Hot module replacement
- Development-only debugging components
- Unminified builds with source maps

### Production
- Compiled and optimized JavaScript
- Minified and compressed assets
- Static generation where possible
- CDN-optimized asset delivery

## Security Considerations

### File Structure Security
- No sensitive data in `/public` directory
- Environment variables properly configured
- Type-safe configuration management
- Proper `.gitignore` patterns

### Build Security
- Dependency vulnerability scanning
- Secure build processes
- Environment-specific configurations
- Proper secret management

This structure ensures maintainability, scalability, and optimal performance while following modern web development best practices.
