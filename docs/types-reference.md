# TypeScript Reference Guide

## Overview
This guide provides comprehensive TypeScript usage patterns, best practices, and type definitions for the Spora One Trust Investor Portal. It ensures type safety, code quality, and maintainability across the entire application.

## TypeScript Configuration

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## Core Type Definitions

### User and Authentication Types

```typescript
// User Profile Types
interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  investment_stage: InvestmentStage;
  kyc_status: KYCStatus;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface InvestmentStage {
  id: number;
  name: string;
  display_name: string;
  description: string;
  color?: string;
  order: number;
}

type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

// Authentication Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  message: string;
  user: UserProfile;
  token: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
}
```

### API Response Types

```typescript
// Generic API Response Types
interface APIResponse<T = any> {
  message: string;
  data?: T;
  success: boolean;
}

interface APIError {
  message: string;
  errors?: ValidationErrors;
  status: number;
}

interface ValidationErrors {
  [field: string]: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: PaginationLink[];
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
```

### Form Types

```typescript
// Form Data Types
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface ProfileUpdateData {
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface PasswordChangeData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// Form Validation Types
interface FormFieldError {
  message: string;
  type: 'required' | 'pattern' | 'min' | 'max' | 'custom';
}

interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}
```

### Component Types

```typescript
// Base Component Props
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

// Layout Component Props
interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
}

// Page Component Props
interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Modal Component Props
interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form Component Props
interface FormProps<T> extends BaseComponentProps {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}
```

## Utility Types

### Common Utility Types

```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract type from array
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Deep partial type
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Pick by type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Omit by type
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};
```

### API Utility Types

```typescript
// Extract response data type
type ResponseData<T> = T extends APIResponse<infer U> ? U : never;

// Create request type from response type
type CreateRequest<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

// Update request type
type UpdateRequest<T> = Partial<CreateRequest<T>>;

// API endpoint configuration
interface APIEndpoint<TRequest = any, TResponse = any> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  requiresAuth: boolean;
  requestType?: TRequest;
  responseType?: TResponse;
}
```

## Hook Types

### Custom Hook Types

```typescript
// State hook return type
interface UseStateReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  reset: () => void;
}

// Async hook return type
interface UseAsyncReturn<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// Form hook return type
interface UseFormReturn<T> {
  data: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: FormFieldError) => void;
  validate: () => boolean;
  reset: () => void;
  isValid: boolean;
  isDirty: boolean;
}

// API hook return type
interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
  mutate: (data: Partial<T>) => Promise<T>;
}
```

### Hook Implementation Examples

```typescript
// Generic async hook
function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>
): UseAsyncReturn<T, E> {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: E | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error: error as E });
      throw error;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Form validation hook
function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules<T>
): UseFormReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, FormFieldError>>>({});

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, FormFieldError>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T;
      const rule = validationRules[field];
      const value = data[field];

      if (rule.required && (!value || value === '')) {
        newErrors[field] = { message: `${String(field)} is required`, type: 'required' };
        isValid = false;
      } else if (rule.pattern && value && !rule.pattern.test(String(value))) {
        newErrors[field] = { message: rule.message || 'Invalid format', type: 'pattern' };
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validationRules]);

  return {
    data,
    errors,
    setValue,
    setError: (field, error) => setErrors(prev => ({ ...prev, [field]: error })),
    validate,
    reset: () => {
      setData(initialData);
      setErrors({});
    },
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(data) !== JSON.stringify(initialData),
  };
}
```

## Component Type Patterns

### Component with Generic Props

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  // Component implementation
}
```

### Higher-Order Component Types

```typescript
// HOC type definition
type WithLoadingProps = {
  loading?: boolean;
};

function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent(props) {
    const { loading, ...componentProps } = props;
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    return <Component {...(componentProps as P)} />;
  };
}

// Usage
const EnhancedUserProfile = withLoading(UserProfile);
```

### Context Type Patterns

```typescript
// Context type definition
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

// Context provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

// Context hook
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## Error Handling Types

### Error Types

```typescript
// Application-specific error types
abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
}

class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
  
  constructor(
    message: string,
    public readonly errors: ValidationErrors
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  readonly statusCode = 401;
  readonly isOperational = true;
  
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class NetworkError extends AppError {
  readonly statusCode = 0;
  readonly isOperational = true;
  
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

// Error boundary types
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

## Type Guards and Validation

### Type Guard Functions

```typescript
// Type guard for checking if value is defined
function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// Type guard for API response
function isAPIError(response: any): response is APIError {
  return response && typeof response.message === 'string' && typeof response.status === 'number';
}

// Type guard for user profile
function isUserProfile(value: any): value is UserProfile {
  return (
    value &&
    typeof value.id === 'number' &&
    typeof value.full_name === 'string' &&
    typeof value.email === 'string'
  );
}

// Generic type guard factory
function createTypeGuard<T>(validator: (value: any) => boolean) {
  return (value: any): value is T => validator(value);
}
```

### Runtime Type Validation

```typescript
// Zod schemas for runtime validation
import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.number(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  investment_stage: z.object({
    id: z.number(),
    name: z.string(),
    display_name: z.string(),
    description: z.string(),
  }),
  kyc_status: z.enum(['not_submitted', 'pending', 'approved', 'rejected']),
  two_factor_enabled: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Infer TypeScript type from Zod schema
type UserProfile = z.infer<typeof UserProfileSchema>;

// Validation function
function validateUserProfile(data: unknown): UserProfile {
  return UserProfileSchema.parse(data);
}
```

## Best Practices

### Type Definition Guidelines

```typescript
// ✅ Good: Use descriptive, specific types
interface UserProfileUpdateRequest {
  full_name?: string;
  email?: string;
  phone?: string;
}

// ❌ Avoid: Generic, vague types
interface UpdateRequest {
  data: any;
}

// ✅ Good: Use union types for limited options
type UserRole = 'admin' | 'manager' | 'investor';

// ❌ Avoid: String types for limited options
type UserRole = string;

// ✅ Good: Use branded types for better type safety
type UserId = number & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

// ✅ Good: Use const assertions for immutable data
const INVESTMENT_STAGES = [
  'PENDING_KYC',
  'KYC_APPROVED',
  'INVESTMENT_READY',
  'INVESTED'
] as const;

type InvestmentStage = typeof INVESTMENT_STAGES[number];
```

### Component Type Best Practices

```typescript
// ✅ Good: Explicit prop interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, size, ...props }) => {
  // Implementation
};

// ✅ Good: Forward ref typing
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, ...props }, ref) => {
    return <button ref={ref} {...props} />;
  }
);

// ✅ Good: Generic component constraints
interface SelectProps<T extends string | number> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

function Select<T extends string | number>({ value, options, onChange }: SelectProps<T>) {
  // Implementation
}
```

### Error Handling Best Practices

```typescript
// ✅ Good: Specific error handling
async function fetchUserProfile(id: number): Promise<UserProfile> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError();
      }
      if (response.status === 404) {
        throw new Error(`User ${id} not found`);
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    const data = await response.json();
    return validateUserProfile(data);
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof Error) {
      throw error;
    }
    throw new NetworkError('Failed to connect to server');
  }
}

// ✅ Good: Type-safe error boundaries
class TypedErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error} />;
      }
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

This TypeScript reference ensures type safety, code quality, and maintainability throughout the Spora One Trust Investor Portal application.
