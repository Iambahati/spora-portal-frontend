# Deployment Guide - Spora One Trust Investor Portal

## Overview
This document provides comprehensive deployment instructions for the Spora One Trust Investor Portal frontend application.

## Prerequisites

### System Requirements
- **Node.js**: 18.17.0 or later
- **npm**: 9.0.0 or later (or yarn/pnpm equivalent)
- **Git**: Latest version
- **SSL Certificate**: For HTTPS in production

### Environment Variables
Create the following environment files:

#### `.env.local` (Development)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000

# Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_PRELOAD_ROUTES=true

# Development
NODE_ENV=development
NEXT_PUBLIC_ENV=development
```

#### `.env.production` (Production)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.spora-bank.com/api
NEXT_PUBLIC_APP_URL=https://investor.spora-bank.com

# Security
NEXTAUTH_SECRET=super-secure-production-secret
NEXTAUTH_URL=https://investor.spora-bank.com

# Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false
NEXT_PUBLIC_PRELOAD_ROUTES=true

# Production
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
```

## Development Deployment

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd investor-portal/frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Setup environment**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
# or for turbo mode
npm run dev:fast
```

5. **Access the application**
- Frontend: http://localhost:3000
- All routes redirect to `/shell` for NexFaster pattern

### Development Scripts

```bash
# Standard development
npm run dev

# Fast development with turbo
npm run dev:fast

# Development with HTTPS
npm run dev:instant

# Performance testing
npm run test:performance

# Router performance testing
npm run test:router-performance

# Bundle analysis
npm run build:analyze
```

## Production Deployment

### Static Export (Recommended)

1. **Build the application**
```bash
npm run build
```

2. **Test production build locally**
```bash
npm run start
```

3. **Generate static export**
```bash
npm run export
```

### Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.spora-bank.com/api
      - NEXT_PUBLIC_APP_URL=https://investor.spora-bank.com
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure environment variables in Vercel dashboard**
- Navigate to Project Settings → Environment Variables
- Add all production environment variables

#### `vercel.json` Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.mjs",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/((?!api|_next|_static|favicon.ico).*)",
      "dest": "/shell"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.spora-bank.com/api"
  }
}
```

### Netlify Deployment

1. **Build configuration**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/shell"
  status = 200
  conditions = {Role = ["admin", "user"]}

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. **Deploy via Git**
- Connect repository to Netlify
- Set build command: `npm run build && npm run export`
- Set publish directory: `out`

### AWS S3 + CloudFront

1. **Build static export**
```bash
npm run build
npm run export
```

2. **S3 Setup**
```bash
# Create S3 bucket
aws s3 mb s3://investor-portal-prod

# Upload files
aws s3 sync out/ s3://investor-portal-prod --delete

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket investor-portal-prod --policy file://bucket-policy.json
```

3. **CloudFront Distribution**
```json
{
  "DistributionConfig": {
    "CallerReference": "investor-portal-2024",
    "DefaultRootObject": "index.html",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3-investor-portal-prod",
          "DomainName": "investor-portal-prod.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-investor-portal-prod",
      "ViewerProtocolPolicy": "redirect-to-https",
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      }
    },
    "CustomErrorResponses": {
      "Quantity": 1,
      "Items": [
        {
          "ErrorCode": 404,
          "ResponsePagePath": "/shell",
          "ResponseCode": "200"
        }
      ]
    },
    "Enabled": true
  }
}
```

## Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name investor.spora-bank.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name investor.spora-bank.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Performance Optimization

### Build Optimization

1. **Bundle Analysis**
```bash
npm run build:analyze
```

2. **Enable compression**
```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  generateEtags: false,
  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

### CDN Configuration

1. **Static Asset Caching**
```javascript
// Cache static assets for 1 year
Cache-Control: public, max-age=31536000, immutable

// Cache HTML for 5 minutes
Cache-Control: public, max-age=300, s-maxage=300
```

2. **Route-based Caching**
```javascript
// For API routes
Cache-Control: private, no-cache, no-store, must-revalidate

// For static pages
Cache-Control: public, max-age=3600, s-maxage=86400
```

## Monitoring and Maintenance

### Health Checks

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### Performance Monitoring

```javascript
// lib/monitoring.js
export const performanceMonitor = {
  trackPageLoad: (pageName) => {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - 
                      window.performance.timing.navigationStart;
      
      console.log(`Page ${pageName} loaded in ${loadTime}ms`);
    }
  }
}
```

### Log Management

```bash
# PM2 logs
pm2 logs --lines 1000

# Docker logs
docker-compose logs -f frontend

# System logs
journalctl -u nginx -f
```

## Security Considerations

### SSL/TLS Configuration
- Use TLS 1.2 or higher
- Implement HSTS headers
- Use strong cipher suites
- Regular certificate renewal

### Content Security Policy
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.spora-bank.com;
```

### Rate Limiting
- Implement rate limiting at nginx/proxy level
- Monitor for unusual traffic patterns
- Set appropriate limits for different endpoints

## Troubleshooting

### Common Issues

1. **Build Failures**
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

2. **Route Issues**
```bash
# Check next.config.mjs rewrites
# Verify React Router configuration
# Test route preloading
```

3. **Performance Issues**
```bash
# Analyze bundle
npm run build:analyze

# Test router performance
npm run test:router-performance
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Next.js debug
NODE_OPTIONS='--inspect' npm run dev
```

This deployment guide ensures a secure, performant, and maintainable production environment for the Spora One Trust Investor Portal.
