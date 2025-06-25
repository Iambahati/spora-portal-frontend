# Copilot Instructions - Spora One Trust Investor Portal

## Project Overview
This is a modern Next.js 14 application implementing the Spora One Trust Investor Portal with React Router for blazing-fast client-side navigation using the NexFaster pattern. The project features comprehensive authentication, KYC document management, investment tracking, and multi-language support.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Router**: React Router DOM 7.6.2 (NexFaster pattern)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4+ with Shadcn/ui components
- **State Management**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **i18n**: Custom i18n implementation
- **Performance**: Custom hooks for optimization and caching

## Code Style Guide

### TypeScript Standards
- Use strict TypeScript with proper typing
- Prefer interfaces over types for object shapes
- Use proper generic constraints
- Always type component props and return types
- Use const assertions where appropriate

```typescript
// ✅ Good
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // Component implementation
}

// ❌ Avoid
const UserProfile = ({ user, onUpdate }: any) => {
  // Implementation
}
```

### Component Structure
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused and single-responsibility
- Use proper file naming: `kebab-case.tsx`
- Export components as default exports

```typescript
// ✅ Component structure
"use client" // Only when necessary

import React from "react"
import { cn } from "@/lib/utils"

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  )
}

export default Component
```

### Styling Guidelines
- Use Tailwind CSS classes exclusively
- Follow mobile-first responsive design
- Use CSS custom properties for theme values
- Maintain consistent spacing scale (4, 8, 12, 16, 24, 32...)
- Use semantic color naming from theme

```typescript
// ✅ Good styling
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-8 md:p-8">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Action
  </button>
</div>
```

### Naming Conventions
- **Files**: `kebab-case.tsx`, `kebab-case.ts`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Props interfaces**: `ComponentNameProps`

### Import Organization
```typescript
// 1. React and Next.js imports
import React from "react"
import { useRouter } from "next/navigation"

// 2. Third-party libraries
import { cn } from "@/lib/utils"

// 3. Internal components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. Types and interfaces
import type { User } from "@/types"

// 5. Hooks and utilities
import { useAuth } from "@/hooks/use-auth"
```

### Error Handling
- Use proper error boundaries
- Implement loading states
- Provide meaningful error messages
- Use toast notifications for user feedback

### API Integration Guidelines
- Use consistent error handling
- Implement proper loading states
- Cache API responses when appropriate
- Use TypeScript for API response types
- Include device headers for session tracking

## Feature Documentation

### Authentication System
- JWT-based authentication with Laravel Sanctum
- Two-factor authentication (TOTP) with QR codes
- Multi-device session management
- Password reset functionality
- Device-specific token management

### UI Components Architecture
- **Base Components**: Located in `/components/ui/`
- **Composite Components**: Located in `/components/`  
- **Page Components**: Located in `/router/pages/`
- All components use shadcn/ui base with custom styling
- Consistent prop interfaces and TypeScript support

### Internationalization (i18n)
- Translation files in `/lib/i18n/translations.ts`
- Context provider in `/lib/i18n/context.tsx`
- Support for English with extensible language system
- Proper fallback handling for missing translations

### Performance Optimizations
- NexFaster pattern with React Router
- Route preloading and caching
- Optimized Suspense boundaries
- Performance monitoring hooks
- Bundle analysis tools

### State Management
- React Hook Form for form state
- Zod for validation schemas
- Custom hooks for complex state logic
- Context providers for global state

## Development Guidelines

### When Adding New Features
1. **Plan the component structure** - Identify reusable parts
2. **Create types first** - Define interfaces and types
3. **Build UI components** - Start with basic functionality
4. **Add validation** - Implement proper error handling
5. **Add i18n support** - Include translation keys
6. **Test responsiveness** - Ensure mobile compatibility
7. **Optimize performance** - Consider lazy loading and caching

### Security Considerations
- Always validate user inputs with Zod
- Sanitize data before displaying
- Use proper CORS configurations
- Implement rate limiting awareness
- Handle authentication tokens securely
- Include device headers for session tracking

### Accessibility Standards
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation support
- Maintain color contrast ratios
- Provide alternative text for images
- Use focus management for modals and forms

### Performance Best Practices
- Lazy load non-critical components
- Optimize images and assets
- Use proper caching strategies
- Implement code splitting
- Monitor bundle sizes
- Use React.memo for expensive components

## File Structure Reference
```
frontend/
├── .github/
│   └── copilot-instructions.md     # This file
├── app/                            # Next.js App Router
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── shell/                      # NexFaster shell
├── components/                     # React components
│   ├── ui/                         # Base UI components (shadcn/ui)
│   └── *.tsx                       # Composite components
├── hooks/                          # Custom React hooks
├── lib/                            # Utilities and configuration
│   ├── i18n/                       # Internationalization
│   └── utils.ts                    # Utility functions
├── router/                         # React Router application
│   ├── app.tsx                     # Main router app
│   ├── components/                 # Router-specific components
│   ├── hooks/                      # Router-specific hooks
│   └── pages/                      # Page components
├── types/                          # TypeScript type definitions
└── public/                         # Static assets
```

## Common Patterns and Examples

### Form Components
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type FormData = z.infer<typeof formSchema>

const LoginForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### API Integration
```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Type': 'web',
          'X-Browser-Name': getBrowserName(),
          'X-OS-Name': getOSName()
        },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('token', data.token)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { user, login, loading }
}
```

## Additional Documentation

For comprehensive information about the project, refer to these documentation files:

### Core Documentation
- **[API Schema](../docs/api-schema.md)**: Complete TypeScript interfaces and API client implementation
- **[Deployment Guide](../docs/deployment.md)**: Production deployment instructions and configurations
- **[Project Structure](../docs/project-structure.md)**: Detailed explanation of file organization and architecture
- **[Routing Guide](../docs/routing-guide.md)**: NexFaster pattern implementation and route management
- **[Style Guide](../docs/style-guide.md)**: UI/UX design system and component styling guidelines
- **[Types Reference](../docs/types-reference.md)**: TypeScript best practices and type definitions
- **[i18n Guide](../docs/i18n-guide.md)**: Internationalization system and translation management
- **[Implementation Plan](../docs/IMPLEMENTATION_PLAN.md)**: Staged development roadmap and task breakdown

### Key Features Overview

#### NexFaster Architecture
This project implements the NexFaster pattern, combining Next.js with React Router for optimal performance:
- All routes redirect to `/shell` via Next.js configuration
- React Router handles client-side navigation for instant transitions
- Route preloading and caching for enhanced user experience
- Server-side rendering benefits with client-side performance

#### Authentication System
Comprehensive authentication with enterprise-grade security:
- JWT-based authentication with Laravel Sanctum backend
- Two-factor authentication (TOTP) with QR code setup
- Multi-device session management and tracking
- Password reset with secure token-based flow
- Device-specific headers for enhanced security

#### KYC Document Management
Complete Know Your Customer verification system:
- Multi-file upload with drag-and-drop interface
- Document validation and image optimization
- Real-time status tracking and notifications
- Investment stage progression based on KYC status
- Admin review interface for document approval

#### Investment Portal Features
Modern investment tracking and management:
- Interactive dashboard with portfolio visualization
- Investment stage tracking and progression
- Real-time data updates and performance metrics
- Responsive design optimized for all devices
- Dark/light theme support throughout

#### Performance Optimizations
Built for speed and scalability:
- Route preloading and intelligent caching
- Optimized bundle splitting and lazy loading
- Performance monitoring and metrics tracking
- Mobile-first responsive design
- SEO optimization with proper meta tags

#### Accessibility & Internationalization
Inclusive design for global users:
- WCAG 2.1 AA compliance
- Multi-language support with extensible i18n system
- Keyboard navigation and screen reader support
- High contrast mode and accessibility features
- RTL language support (future enhancement)

### Development Workflow

#### Before Starting Development
1. Review the [Implementation Plan](../docs/IMPLEMENTATION_PLAN.md) for current phase objectives
2. Check [API Schema](../docs/api-schema.md) for required types and interfaces
3. Refer to [Style Guide](../docs/style-guide.md) for design consistency
4. Follow [Types Reference](../docs/types-reference.md) for TypeScript best practices

#### When Adding New Features
1. **Plan First**: Identify reusable components and required types
2. **Design System**: Use existing UI components from `/components/ui/`
3. **Type Safety**: Define interfaces before implementation
4. **i18n Support**: Add translation keys to `/lib/i18n/translations.ts`
5. **Routing**: Follow [Routing Guide](../docs/routing-guide.md) for new routes
6. **Testing**: Write tests for critical functionality
7. **Documentation**: Update relevant documentation files

#### Quality Standards
- All components must be TypeScript-compliant with proper typing
- Follow the established naming conventions and file structure
- Implement proper error handling and loading states
- Ensure accessibility compliance (WCAG 2.1 AA)
- Test on mobile devices and different screen sizes
- Validate with ESLint and Prettier before committing

Remember to always follow these guidelines when contributing to the codebase. The goal is to maintain consistency, performance, and maintainability across the entire application.
