# Spora One Trust Investor Portal - Frontend

A modern, secure investor portal frontend built with React, TypeScript, and Vite. Features include enterprise-grade authentication, KYC document management, investment tracking, and high-performance routing using the NexFaster pattern (Next.js + React Router).

## Overview

This project provides a robust, maintainable frontend for the Spora One Trust Investor Portal. It is designed for security, performance, and developer productivity, with a focus on type safety, accessibility, and scalability.

## Features

- Persistent authentication with JWT and multi-device session management
- KYC document upload and verification
- Investment dashboard and tracking
- Role-based access control and route protection
- Responsive, accessible UI with Tailwind CSS and Shadcn/ui
- Internationalization (i18n) support
- High-performance routing and route preloading
- Comprehensive error handling and loading states

## Authentication System

Authentication is managed by a centralized AuthService (`lib/auth.ts`) and React Context (`lib/auth-context.tsx`).

- **Persistence**: Users remain logged in across browser refreshes
- **Token Management**: Secure storage and validation of JWT tokens
- **Session Management**: Multi-device support and device tracking headers
- **Error Handling**: Graceful handling of network, validation, and authentication errors
- **React Integration**: State and actions provided via `useAuthState` hook

### AuthContext Usage Example

```typescript
import { useAuthState } from '@/lib/auth-context'

const { isAuthenticated, user, login, logout } = useAuthState()
```

### Route Protection Example

```typescript
import { useAuthState } from '@/lib/auth-context'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthState()
  if (loading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/auth/signin" />
  return <>{children}</>
}
```

## Project Structure

```
frontend/
├── app/                  # Next.js App Router shell
├── components/           # UI and composite components
│   ├── ui/               # Shadcn/ui base components
│   └── auth/             # Auth-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, AuthService, API client, i18n
├── public/               # Static assets
├── router/               # React Router app and pages
├── scripts/              # Utility and validation scripts
├── styles/               # Global and component styles
├── types/                # TypeScript type definitions
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Technology Stack

- **Framework**: React, Next.js (App Router shell)
- **Routing**: React Router DOM
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Forms**: React Hook Form, Zod
- **State**: React Context, custom hooks
- **Auth**: JWT, centralized AuthService
- **Bundler**: Vite

## Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:8001/api
VITE_APP_URL=http://localhost:5173
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript validation

Performance and router optimization scripts are available in the `scripts/` directory.

## Environment Configuration

See `.env.local` for all available environment variables. Router and performance options can be enabled for advanced use cases.

## Performance and Optimization

- Route preloading and intelligent caching for fast navigation
- Bundle splitting and lazy loading
- Performance monitoring utilities
- Optimized for modern browsers

## Security Considerations

- JWT tokens are securely managed and validated
- Device headers included for all API requests
- HTTPS required in production
- Input validation on both client and server
- No sensitive data exposed in client storage

## Deployment

### Build and Run

```bash
npm run build
npm run preview
```

### Docker

A Dockerfile is provided for containerized deployment. See the Dockerfile and parent directory for details.

## Internationalization

- Context-based i18n system
- Translation files in `lib/i18n/`
- Language switcher component available

## Support and Documentation

- [API Schema Documentation](./docs/api-schema.md)
- [Routing Guide](./docs/routing-guide.md)
- [Style Guide](./docs/style-guide.md)
- [TypeScript Reference](./docs/types-reference.md)
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)

## License

This project is proprietary software for Spora One Trust. All rights reserved.

---

**Note:** This frontend is part of a larger Laravel-based investor portal system. The backend API must be running and accessible for full functionality.
