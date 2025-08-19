# Design Document

## Overview

The modern portfolio is a high-performance, accessible personal website built with Next.js 14 App Router, featuring rich animations, dynamic theming, and comprehensive content management. The architecture emphasizes performance, accessibility, and maintainability while delivering a visually engaging 2025-era user experience.

## Architecture

### Technology Stack

**Core Framework:**

- Next.js 14 with App Router for SSR/SSG and modern React features
- TypeScript for type safety and developer experience
- React 19 for latest concurrent features

**Styling & UI:**

- Tailwind CSS 4 for utility-first styling
- shadcn/ui for consistent, accessible component library
- CSS custom properties for dynamic theming

**Animation Libraries:**

- Framer Motion for page transitions, micro-interactions, and layout animations
- GSAP + ScrollTrigger for scroll-based choreography and complex sequences
- Dynamic imports to minimize bundle size

**Data & Content:**

- MDX for project content with frontmatter
- RSS parsing for Medium blog integration
- JSON for structured data (tech stack, chat context)

**Communication:**

- Resend or Nodemailer for email functionality
- Streaming API for chatbot responses
- Rate limiting with token bucket algorithm

### Application Structure

```
/app
├── (site)/                 # Main site group
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading UI
│   └── not-found.tsx      # 404 page
├── projects/
│   ├── page.tsx           # Projects index with filtering
│   ├── [slug]/
│   │   └── page.tsx       # Individual project pages
│   └── loading.tsx
├── tech/page.tsx          # Tech stack overview
├── blog/page.tsx          # Blog posts from Medium
├── contact/page.tsx       # Contact form
└── api/
    ├── blog/latest/route.ts    # Medium RSS endpoint
    ├── contact/route.ts        # Contact form handler
    └── chat/route.ts           # Chatbot streaming
```

## Components and Interfaces

### Core Layout Components

**Header Component**

```typescript
interface HeaderProps {
  currentPath: string;
  onThemeToggle: () => void;
  onAccentChange: (color: string) => void;
}
```

- Sticky positioning with backdrop blur
- Navigation with active state indicators
- Theme toggle and accent color picker
- Skip link for accessibility

**Footer Component**

- Minimal design with social links
- Contact email and copyright
- Consistent spacing with main content

### Content Components

**HeroIntro Component**

```typescript
interface HeroIntroProps {
  title: string;
  subtitle: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
}
```

- Animated text reveal with staggered timing
- Gradient background with subtle particle effects
- Responsive typography scaling

**ProjectCard Component**

```typescript
interface ProjectCardProps {
  project: {
    title: string;
    slug: string;
    summary: string;
    year: number;
    tech: string[];
    cover: string;
    liveUrl?: string;
    repoUrl?: string;
  };
  index?: number;
}
```

- Hover animations with tilt and parallax
- Lazy-loaded optimized images
- Accessible keyboard navigation

**ProjectsGrid Component**

```typescript
interface ProjectsGridProps {
  projects: Project[];
  filters: {
    q?: string;
    tech?: string;
    year?: number;
  };
  onFilterChange: (filters: Filters) => void;
}
```

- Masonry or grid layout options
- Real-time filtering with URL persistence
- Staggered entrance animations

### Interactive Components

**TechBadge Component**

```typescript
interface TechBadgeProps {
  tech: {
    name: string;
    level: "learning" | "intermediate" | "advanced" | "expert";
    useCases: string[];
    since: number;
    site?: string;
  };
}
```

- Hover tooltips with additional information
- Confidence level indicators
- Grouped by technology domain

**ChatbotButton & ChatPanel Components**

- Floating action button with expand animation
- Streaming message interface
- Context-aware responses with deep linking
- Quick reply suggestions

## Data Models

### Project Schema (MDX Frontmatter)

```typescript
interface Project {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  year: number;
  repoUrl?: string;
  liveUrl?: string;
  tech: string[];
  cover: string;
  gallery?: string[];
  featured: boolean;
  order: number;
}
```

### Tech Stack Schema

```typescript
interface TechItem {
  name: string;
  level: "learning" | "intermediate" | "advanced" | "expert";
  useCases: string[];
  since: number;
  site?: string;
  domain: "frontend" | "backend" | "infrastructure" | "data" | "web3";
}
```

### Blog Item Schema

```typescript
interface BlogItem {
  title: string;
  url: string;
  publishedAt: string;
  preview: string;
}
```

### Chat Context Schema

```typescript
interface ChatContext {
  bio: string;
  skills: string[];
  projectsIndex: Array<{
    title: string;
    slug: string;
    summary: string;
    tech: string[];
  }>;
  faq: Array<{
    q: string;
    a: string;
  }>;
}
```

## Error Handling

### Client-Side Error Boundaries

- React Error Boundaries for component-level failures
- Graceful degradation for animation failures
- Fallback UI for missing content

### API Error Handling

- Structured error responses with appropriate HTTP status codes
- Rate limiting with clear error messages
- Retry logic for transient failures

### Content Loading Errors

- Skeleton UI during loading states
- Error states for failed content fetching
- Offline-friendly caching strategies

## Testing Strategy

### Unit Testing

- Component testing with React Testing Library
- Utility function testing for data parsing and validation
- Animation testing with reduced motion considerations

### Integration Testing

- API route testing with mock data
- Form submission and validation testing
- Email delivery testing with test providers

### End-to-End Testing

- Playwright tests for critical user journeys
- Performance testing with Lighthouse CI
- Accessibility testing with axe-core

### Performance Testing

- Bundle size monitoring
- Core Web Vitals tracking
- Animation performance profiling

## Animation System Design

### Motion Tokens

```typescript
const motionTokens = {
  duration: {
    xs: "120ms",
    s: "240ms",
    m: "420ms",
    l: "700ms",
  },
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 300,
  },
};
```

### Framer Motion Usage

- Page transitions with direction awareness
- List item staggering for content reveals
- Hover and tap micro-interactions
- Shared layout animations for filter states

### GSAP ScrollTrigger Usage

- Section reveal animations on scroll
- Parallax effects for hero and project images
- Multi-element orchestrated sequences
- Performance-optimized transform animations

### Reduced Motion Implementation

```typescript
const prefersReducedMotion = useReducedMotion();

const animationProps = prefersReducedMotion
  ? { initial: false, animate: false }
  : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
```

## Theming System

### Color System

- Neutral base palette (gray-50 to gray-950)
- Dynamic accent color generation from visitor seed
- HSL color space for programmatic manipulation
- WCAG AA contrast compliance

### Typography Scale

```css
--font-display: "Inter Display", system-ui, sans-serif;
--font-body: "Inter", system-ui, sans-serif;

--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */
--text-6xl: 3.75rem; /* 60px */
```

### Spacing System

- 8px base unit for consistent spacing
- Section spacing: 120-160px desktop, 80-120px mobile
- Component spacing follows 4px grid alignment

## Performance Optimization

### Code Splitting Strategy

- Route-based splitting with Next.js App Router
- Dynamic imports for heavy libraries (GSAP, chart libraries)
- Component-level splitting for large interactive elements

### Image Optimization

- next/image with responsive sizing
- AVIF/WebP format prioritization
- Lazy loading with intersection observer
- Blur placeholder generation

### Caching Strategy

- Static generation for project pages
- ISR for blog content (30-60 minute revalidation)
- Browser caching for static assets
- Service worker for offline functionality

### Bundle Optimization

- Tree shaking for unused code elimination
- Webpack bundle analyzer integration
- Critical CSS inlining
- Preloading for above-the-fold resources

## Security Considerations

### Form Security

- CSRF protection with SameSite cookies
- Input sanitization and validation
- Rate limiting per IP address
- Honeypot fields for spam detection

### API Security

- Request validation with Zod schemas
- Environment variable protection
- CORS configuration
- Request size limits

### Content Security

- Content Security Policy headers
- XSS protection for user-generated content
- Secure headers configuration
- HTTPS enforcement

## SEO and Metadata

### Structured Data

- JSON-LD for Person schema
- CreativeWork schema for projects
- Organization schema for professional info
- BreadcrumbList for navigation

### Meta Tags Strategy

- Dynamic OG image generation per page
- Twitter Card optimization
- Canonical URL management
- Sitemap generation with priority scoring

### Performance Metrics

- Core Web Vitals monitoring
- Real User Monitoring (RUM)
- Lighthouse CI integration
- Performance budgets enforcement
