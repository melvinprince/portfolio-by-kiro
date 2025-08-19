# Contact Form Implementation

This directory contains the contact form implementation with the following features:

## Features

- **Form Validation**: Uses Zod schema validation for client-side and server-side validation
- **Rate Limiting**: IP-based rate limiting (5 requests per hour) to prevent spam
- **Honeypot Protection**: Hidden field to catch automated spam submissions
- **Email Service**: Integration with Resend for sending emails
- **Responsive Design**: Mobile-friendly form with proper accessibility
- **Success Animations**: Smooth animations for form states (respects reduced motion preferences)
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Components

### ContactForm (`contact-form.tsx`)

The main contact form component with:

- Real-time validation feedback
- Character count for message field
- Loading states during submission
- Success/error animations
- Accessibility features (proper labels, ARIA attributes)

### UI Components

- `textarea.tsx` - Custom textarea component
- `checkbox.tsx` - Custom checkbox component with Radix UI

## API Route

### `/api/contact` (`route.ts`)

Handles form submissions with:

- Request validation using Zod schema
- Rate limiting by IP address
- Honeypot spam detection
- Email sending via Resend service
- Proper error responses and logging

## Libraries and Services

### Rate Limiter (`rate-limiter.ts`)

- Token bucket algorithm implementation
- In-memory storage (suitable for single-instance deployments)
- Automatic cleanup of old entries
- Configurable limits (default: 5 requests per hour)

### Email Service (`email-service.ts`)

- Singleton pattern for email service
- HTML email templates
- Support for confirmation emails
- Error handling and logging
- Lazy initialization to avoid build-time errors

### Schema (`contact-schema.ts`)

- Zod validation schema
- Type definitions
- Default form values
- Input sanitization rules

## Environment Variables

Required environment variables:

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your_email@example.com
```

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install resend @radix-ui/react-checkbox
   ```

2. **Configure Environment Variables**:

   - Copy `.env.example` to `.env.local`
   - Set up a Resend account and get your API key
   - Configure your email addresses

3. **Verify Domain** (for production):
   - Add your domain to Resend
   - Verify domain ownership
   - Update `FROM_EMAIL` to use your verified domain

## Security Features

- **Rate Limiting**: Prevents abuse with IP-based limiting
- **Honeypot Field**: Hidden field to catch bots
- **Input Validation**: Server-side validation with Zod
- **XSS Protection**: HTML escaping in email templates
- **CSRF Protection**: Built into Next.js API routes

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader friendly error messages
- Respects user's motion preferences
- High contrast error states

## Testing

The form can be tested by:

1. Filling out valid information
2. Testing validation errors
3. Testing rate limiting (submit 6+ times quickly)
4. Testing honeypot (programmatically fill the hidden field)

## Customization

### Styling

The form uses Tailwind CSS classes and can be customized by modifying the component styles.

### Validation Rules

Update `contact-schema.ts` to modify validation rules:

- Name length limits
- Email format requirements
- Message length limits
- Additional fields

### Rate Limiting

Modify `rate-limiter.ts` to adjust:

- Request limits per time period
- Time windows
- Storage mechanism (consider Redis for multi-instance deployments)

### Email Templates

Update `email-service.ts` to customize:

- Email HTML templates
- Subject lines
- Sender information
