# Style Guide - Spora One Trust Investor Portal

## Overview
This style guide defines the visual design system and UI/UX patterns for the Spora One Trust Investor Portal. It ensures consistency, accessibility, and maintainability across the entire application.

## Brand Identity

### Logo and Brand
- **Primary Logo**: Spora One Trust logo with modern, trustworthy design
- **Favicon**: Simplified version of the logo for browser tabs
- **Brand Voice**: Professional, secure, innovative, accessible

### Brand Values
- **Trust**: Security-first design with clear communication
- **Innovation**: Modern interface with cutting-edge technology
- **Accessibility**: Inclusive design for all users
- **Professionalism**: Clean, corporate aesthetic

## Color System

### Primary Colors

```css
:root {
  /* Primary Brand Colors */
  --primary: #eb6e03;           /* Spora Orange */
  --primary-foreground: #ffffff; /* White text on primary */
  --secondary: #040956;         /* Spora Navy */
  --secondary-foreground: #ffffff; /* White text on secondary */
}
```

**Usage:**
- **Primary (#eb6e03)**: Call-to-action buttons, active states, brand elements
- **Secondary (#040956)**: Headers, important text, navigation elements

### Neutral Colors

```css
:root {
  /* Light Theme */
  --background: #ffffff;        /* Page background */
  --foreground: #020617;        /* Primary text */
  --muted: #f1f5f9;            /* Subtle backgrounds */
  --muted-foreground: #64748b;  /* Secondary text */
  --border: #e2e8f0;           /* Borders and dividers */
  --input: #e2e8f0;            /* Input field borders */
  --ring: #eb6e03;             /* Focus rings */
}

/* Dark Theme */
[data-theme="dark"] {
  --background: #020617;
  --foreground: #f8fafc;
  --muted: #0f172a;
  --muted-foreground: #64748b;
  --border: #1e293b;
  --input: #1e293b;
  --ring: #eb6e03;
}
```

### Status Colors

```css
:root {
  /* Status Colors */
  --success: #22c55e;          /* Success states */
  --success-foreground: #ffffff;
  --warning: #f59e0b;          /* Warning states */
  --warning-foreground: #ffffff;
  --destructive: #ef4444;      /* Error/danger states */
  --destructive-foreground: #ffffff;
  --info: #3b82f6;            /* Information states */
  --info-foreground: #ffffff;
}
```

### Color Usage Guidelines

**Do:**
- Use primary color for main actions and brand elements
- Use secondary color for navigation and important headings
- Maintain sufficient contrast ratios (4.5:1 minimum)
- Use status colors consistently across the application

**Don't:**
- Mix warm and cool variants of the same color
- Use colors that don't meet accessibility standards
- Override semantic color meanings

## Typography

### Font Family

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}
```

### Type Scale

```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */
```

### Font Weights

```css
.font-thin { font-weight: 100; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }    /* Default body text */
.font-medium { font-weight: 500; }    /* Emphasis */
.font-semibold { font-weight: 600; }  /* Subheadings */
.font-bold { font-weight: 700; }      /* Headings */
.font-extrabold { font-weight: 800; } /* Hero text */
```

### Typography Hierarchy

```tsx
// Page Title
<h1 className="text-3xl font-bold text-foreground">
  Page Title
</h1>

// Section Heading
<h2 className="text-2xl font-semibold text-foreground mb-4">
  Section Heading
</h2>

// Subsection Heading
<h3 className="text-xl font-medium text-foreground mb-3">
  Subsection Heading
</h3>

// Body Text
<p className="text-base text-foreground leading-relaxed">
  Regular body text content
</p>

// Secondary Text
<p className="text-sm text-muted-foreground">
  Secondary information
</p>

// Caption Text
<span className="text-xs text-muted-foreground">
  Caption or helper text
</span>
```

## Spacing System

### Scale
Based on a 4px grid system for consistent spacing:

```css
/* Spacing Scale (rem values) */
.space-0 { margin/padding: 0; }        /* 0px */
.space-1 { margin/padding: 0.25rem; }  /* 4px */
.space-2 { margin/padding: 0.5rem; }   /* 8px */
.space-3 { margin/padding: 0.75rem; }  /* 12px */
.space-4 { margin/padding: 1rem; }     /* 16px */
.space-6 { margin/padding: 1.5rem; }   /* 24px */
.space-8 { margin/padding: 2rem; }     /* 32px */
.space-12 { margin/padding: 3rem; }    /* 48px */
.space-16 { margin/padding: 4rem; }    /* 64px */
.space-20 { margin/padding: 5rem; }    /* 80px */
```

### Usage Guidelines

```tsx
// Card spacing
<Card className="p-6">        {/* 24px internal padding */}
  <CardHeader className="pb-4"> {/* 16px bottom padding */}
    <CardTitle className="mb-2">  {/* 8px bottom margin */}
      Title
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4"> {/* 16px vertical gaps */}
    Content items
  </CardContent>
</Card>

// Form spacing
<form className="space-y-6">    {/* 24px between form sections */}
  <div className="space-y-2">   {/* 8px between label and input */}
    <Label>Field Label</Label>
    <Input />
  </div>
</form>
```

## Layout System

### Container System

```tsx
// Main page container
<div className="container mx-auto px-4 py-8 max-w-7xl">
  Page content
</div>

// Content sections
<section className="mb-12">
  Section content
</section>

// Card containers
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card>Content</Card>
</div>
```

### Responsive Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Small desktops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Grid System

```tsx
// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  Grid items
</div>

// Flexible layouts
<div className="flex flex-col md:flex-row gap-6">
  <aside className="md:w-1/4">Sidebar</aside>
  <main className="md:w-3/4">Main content</main>
</div>
```

## Component Styles

### Buttons

```tsx
// Primary button
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Primary Action
</Button>

// Secondary button
<Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
  Secondary Action
</Button>

// Destructive button
<Button variant="destructive">
  Delete Action
</Button>

// Ghost button
<Button variant="ghost" className="text-muted-foreground hover:text-foreground">
  Subtle Action
</Button>
```

### Form Elements

```tsx
// Text input
<Input 
  className="border-input focus:ring-ring focus:border-ring" 
  placeholder="Enter text..."
/>

// Select dropdown
<Select>
  <SelectTrigger className="border-input">
    <SelectValue placeholder="Choose option..." />
  </SelectTrigger>
</Select>

// Checkbox
<Checkbox 
  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
/>
```

### Cards and Containers

```tsx
// Standard card
<Card className="border-border shadow-sm">
  <CardHeader className="border-b border-border">
    <CardTitle>Card Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Card description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6">
    Card content
  </CardContent>
</Card>

// Interactive card
<Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
  Interactive content
</Card>
```

### Navigation Elements

```tsx
// Navigation menu
<nav className="bg-background border-b border-border">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Logo />
      <NavigationMenu />
      <UserMenu />
    </div>
  </div>
</nav>

// Breadcrumbs
<Breadcrumb className="text-sm text-muted-foreground mb-6">
  <BreadcrumbItem>
    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbPage>Current Page</BreadcrumbPage>
  </BreadcrumbItem>
</Breadcrumb>
```

## States and Interactions

### Loading States

```tsx
// Skeleton loading
<div className="space-y-4">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-8 w-1/2" />
</div>

// Button loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Error States

```tsx
// Form field error
<div className="space-y-2">
  <Input className="border-destructive focus:ring-destructive" />
  <p className="text-sm text-destructive">Error message here</p>
</div>

// Alert error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

### Success States

```tsx
// Success alert
<Alert className="border-success text-success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

// Success toast
toast.success("Profile updated successfully!")
```

## Accessibility Guidelines

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Maintain contrast in all states

### Focus Management

```tsx
// Visible focus indicators
<Button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Button
</Button>

// Skip links
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
>
  Skip to main content
</a>
```

### Semantic HTML

```tsx
// Proper heading hierarchy
<main>
  <h1>Page Title</h1>
  <section aria-labelledby="section-1">
    <h2 id="section-1">Section Title</h2>
    <h3>Subsection Title</h3>
  </section>
</main>

// Form labels
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input id="email" type="email" aria-describedby="email-help" />
  <p id="email-help" className="text-sm text-muted-foreground">
    We'll never share your email
  </p>
</div>
```

## Animation and Transitions

### Micro-interactions

```css
/* Hover transitions */
.transition-colors { transition: color 150ms ease-in-out; }
.transition-shadow { transition: box-shadow 150ms ease-in-out; }
.transition-transform { transition: transform 150ms ease-in-out; }

/* Scale animations */
.hover:scale-105:hover { transform: scale(1.05); }
.active:scale-95:active { transform: scale(0.95); }
```

### Loading Animations

```tsx
// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>

// Pulse loading
<div className="animate-pulse bg-muted rounded h-4 w-full"></div>

// Bounce loading
<div className="flex space-x-1">
  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
</div>
```

## Dark Theme Support

### Theme Implementation

```tsx
// Theme provider setup
<ThemeProvider defaultTheme="system" storageKey="spora-ui-theme">
  <App />
</ThemeProvider>

// Theme toggle
<Button
  variant="ghost"
  size="sm"
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
>
  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</Button>
```

### Dark Theme Considerations

```tsx
// Images with theme variants
<img 
  src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
  alt="Spora One Trust Logo" 
/>

// Theme-aware styling
<div className="bg-background text-foreground border border-border">
  Content that adapts to theme
</div>
```

## Performance Considerations

### CSS Optimization
- Use CSS custom properties for theme values
- Minimize CSS specificity conflicts
- Leverage Tailwind's purging for smaller bundles
- Use `transform` and `opacity` for animations

### Component Optimization
- Memoize expensive style calculations
- Use CSS-in-JS sparingly
- Prefer Tailwind classes over inline styles
- Optimize re-renders with proper component structure

## Style Guide Checklist

### Before Implementation
- [ ] Colors meet accessibility contrast requirements
- [ ] Typography hierarchy is logical and consistent
- [ ] Spacing follows the 4px grid system
- [ ] Components work in both light and dark themes
- [ ] Interactive states are clearly defined
- [ ] Loading and error states are implemented

### During Development
- [ ] Use semantic HTML elements
- [ ] Implement proper focus management
- [ ] Test with keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Test responsive behavior
- [ ] Validate color contrast

### Quality Assurance
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] Style consistency maintained

This style guide ensures a cohesive, accessible, and professional user interface that reflects the Spora One Trust brand while providing an excellent user experience across all devices and accessibility needs.
