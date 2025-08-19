# Deployment Guide

This guide covers the deployment setup and configuration for the modern portfolio website.

## Environment Configuration

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio
   npm install
   ```

2. **Configure environment variables**

   ```bash
   npm run setup:env
   ```

   Or manually copy and configure:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Validate configuration**

   ```bash
   npm run validate:env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Production Environment Variables

#### Required Variables

- `NEXT_PUBLIC_SITE_URL` - Your production domain (must use HTTPS)
- `NEXT_PUBLIC_SITE_NAME` - Your portfolio name
- `NEXT_PUBLIC_SITE_DESCRIPTION` - Site description for SEO

#### Email Configuration (Optional)

- `RESEND_API_KEY` - Resend API key for contact form
- `FROM_EMAIL` - Email address for sending (must be verified domain)
- `TO_EMAIL` - Your email address to receive messages
- `CONTACT_EMAIL` - Contact email displayed on site

#### Medium Integration (Optional)

- `MEDIUM_USERNAME` - Your Medium username (e.g., @yourname)
- `NEXT_PUBLIC_MEDIUM_USERNAME` - Same as above (for client-side)

#### Analytics (Optional)

**Vercel Analytics:**

- `VERCEL_ANALYTICS_ID` - Set to "auto" for automatic setup
- `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

**Plausible Analytics:**

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Your domain (e.g., yourname.dev)
- `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

#### Performance Monitoring

- `NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true` - Enable Web Vitals tracking

## Deployment Platforms

### Vercel (Recommended)

1. **Connect repository to Vercel**

   - Import project from GitHub/GitLab/Bitbucket
   - Vercel will auto-detect Next.js configuration

2. **Configure environment variables**

   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Set different values for Preview/Production as needed

3. **Configure domains**

   - Add your custom domain in Project Settings → Domains
   - Configure DNS records as instructed

4. **Enable analytics** (if using Vercel Analytics)
   - Go to Project Settings → Analytics
   - Enable Web Analytics and Speed Insights

### Netlify

1. **Build configuration**

   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Configure environment variables**
   - Go to Site Settings → Environment Variables
   - Add all production environment variables

### Self-hosted (Docker)

1. **Create Dockerfile** (already included)
2. **Build and run**
   ```bash
   docker build -t portfolio .
   docker run -p 3000:3000 --env-file .env.production portfolio
   ```

## Performance Monitoring

### Lighthouse CI

The project includes automated Lighthouse CI for performance monitoring:

- **Desktop configuration**: `lighthouserc.json`
- **Mobile configuration**: `lighthouserc.mobile.json`
- **Performance budgets**: `performance-budget.json`

#### Local Performance Testing

```bash
# Build and test performance
npm run perf:audit

# Run Lighthouse CI
npm run perf:ci

# Mobile performance test
npm run lhci:mobile
```

#### CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

1. Runs type checking and linting
2. Builds the application
3. Performs Lighthouse audits (desktop and mobile)
4. Deploys to preview/production

#### Required GitHub Secrets

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub app token (optional)

## Analytics Setup

### Vercel Analytics

1. Enable in Vercel dashboard
2. Set `VERCEL_ANALYTICS_ID=auto`
3. Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

### Plausible Analytics

1. Create account at plausible.io
2. Add your domain
3. Set environment variables:
   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

## Security Considerations

### Environment Variables

- Never commit `.env.local` or `.env.production` to version control
- Use different API keys for development and production
- Regularly rotate API keys and tokens

### Headers

The application includes security headers:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Rate Limiting

Contact form includes rate limiting:

- 5 requests per hour per IP address
- Configurable via `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`

## Troubleshooting

### Build Failures

1. **Type errors**: Run `npm run type-check`
2. **Lint errors**: Run `npm run lint:fix`
3. **Environment validation**: Run `npm run validate:env`

### Performance Issues

1. **Bundle size**: Run `npm run analyze` to analyze bundle
2. **Lighthouse scores**: Check `lighthouse-report.html` after running audits
3. **Core Web Vitals**: Monitor in production with analytics

### Email Issues

1. **Verify domain**: Ensure FROM_EMAIL domain is verified with Resend
2. **API limits**: Check Resend dashboard for usage and limits
3. **Spam filtering**: Ensure proper SPF/DKIM records

### Analytics Issues

1. **Plausible**: Check domain configuration and script loading
2. **Vercel**: Verify analytics are enabled in Vercel dashboard
3. **Ad blockers**: Some users may have analytics blocked

## Monitoring and Maintenance

### Regular Tasks

- Monitor Core Web Vitals in production
- Review Lighthouse CI reports
- Update dependencies monthly
- Monitor email delivery rates
- Check analytics data quality

### Performance Budgets

The project enforces performance budgets:

- JavaScript: 180KB gzipped
- Total page size: 500KB
- LCP: < 2.5s
- CLS: < 0.1
- FID: < 100ms

### Alerts

Set up monitoring alerts for:

- Build failures
- Performance regressions
- High error rates
- Email delivery failures

## Support

For deployment issues:

1. Check the troubleshooting section above
2. Review environment variable configuration
3. Verify all required services are properly configured
4. Check platform-specific documentation (Vercel, Netlify, etc.)
