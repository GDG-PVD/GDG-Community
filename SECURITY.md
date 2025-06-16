# Security Guidelines for GDG Community Companion

This document outlines security best practices and known issues for the GDG Community Companion boilerplate. As an open-source template, it's crucial to address these security considerations before deploying to production.

## 🚨 Critical Security Issues to Address

### 1. **Remove Hardcoded Credentials**
**CRITICAL**: The following files contain hardcoded credentials that MUST be removed:
- `/scripts/test-login-now.js` - Contains email and password
- `/scripts/test-web-auth.js` - Contains email, password, and Firebase config
- `/scripts/fix-user-doc.js` - Contains email address

**Action Required**: 
- Delete these scripts or move credentials to environment variables
- Change any exposed passwords immediately
- Rotate Firebase API keys if compromised

### 2. **Disable Mock Authentication in Production**
The application includes a mock authentication mode for development that bypasses security:
- Mock auth gives admin access with ANY credentials
- Controlled by `REACT_APP_MOCK_AUTH_ENABLED` environment variable

**Action Required**:
- Ensure `REACT_APP_MOCK_AUTH_ENABLED=false` in production
- Consider removing mock auth code entirely for production builds
- Add runtime checks to prevent accidental enablement

## 🔒 Firebase Security Configuration

### Firestore Rules
Review and customize the Firestore security rules in `firestore.rules`:
- Public read access is enabled for events and posts - verify if this is intended
- Admin role check relies on user document - ensure user creation is properly controlled
- Consider adding rate limiting rules

### Storage Rules
Fix the storage rules in `storage.rules`:
```javascript
// INCORRECT - $(database) is not available in storage context
exists(/databases/$(database)/documents/members/$(request.auth.uid))

// CORRECT - Use Firestore instance directly
exists(/databases/XXX/documents/members/$(request.auth.uid))
```

**Additional Storage Security**:
- Add file size limits: `request.resource.size < 5 * 1024 * 1024; // 5MB`
- Add file type validation: `request.resource.contentType.matches('image/.*')`
- Implement virus scanning for uploaded files

## 🛡️ Input Validation & XSS Prevention

### Current Status
✅ Good practices in place:
- React's automatic XSS protection via JSX
- No use of `dangerouslySetInnerHTML`
- Material-UI components handle basic sanitization

⚠️ Areas needing improvement:

### 1. File Upload Validation
```typescript
// Add server-side validation for file uploads
const validateFileUpload = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
};
```

### 2. URL Parameter Validation
```typescript
// Add validation for URL parameters
import { z } from 'zod';

const EventIdSchema = z.string().uuid();

// In your component
const { eventId } = useParams();
try {
  const validatedEventId = EventIdSchema.parse(eventId);
  // Use validatedEventId
} catch (error) {
  // Handle invalid input
}
```

### 3. Form Input Validation
Add character limits and validation to all text inputs:
```typescript
<TextField
  inputProps={{ maxLength: 100 }}
  error={value.length > 100}
  helperText={value.length > 100 ? "Maximum 100 characters" : ""}
/>
```

## 🔐 Environment Variables

### Required Security Measures
1. **Never commit `.env` files** - Already in `.gitignore` ✅
2. **Use appropriate prefixes**:
   - `REACT_APP_` for client-side variables (will be exposed)
   - Server-side variables without prefix (kept secret)
3. **Validate all environment variables at startup**:

```typescript
// Add to your app initialization
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  // ... other required vars
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## 🌐 API & Network Security

### Firebase API Keys
- Firebase API keys are meant to be public but MUST be restricted:
  1. Go to Google Cloud Console
  2. Navigate to "APIs & Services" > "Credentials"
  3. Click on your Firebase API key
  4. Under "Application restrictions", select "HTTP referrers"
  5. Add your production domains only

### CORS Configuration
For Cloud Functions, implement proper CORS:
```javascript
const cors = require('cors')({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : true
});
```

### Rate Limiting
Implement rate limiting for API endpoints:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🚫 Error Handling

### Remove Sensitive Information from Errors
1. Remove all `console.log` and `console.error` statements that expose sensitive data
2. Use generic error messages for users:

```typescript
try {
  // ... code
} catch (error) {
  // Log detailed error server-side only
  console.error('Auth error:', error); // Remove in production
  
  // Show generic message to user
  setError('Authentication failed. Please try again.');
}
```

## 📋 Security Checklist Before Deployment

- [ ] Remove all hardcoded credentials from scripts
- [ ] Set `REACT_APP_MOCK_AUTH_ENABLED=false`
- [ ] Configure Firebase API key restrictions
- [ ] Update Firestore and Storage security rules
- [ ] Implement file upload validation (type, size, content)
- [ ] Add input validation for all forms
- [ ] Remove console.log statements with sensitive data
- [ ] Set up Content Security Policy headers
- [ ] Configure CORS properly for production
- [ ] Implement rate limiting
- [ ] Review and test all Firebase security rules
- [ ] Enable Firebase App Check for additional security
- [ ] Set up monitoring and alerting for security events

## 🔍 Monitoring & Incident Response

### Set Up Security Monitoring
1. Enable Firebase Security Rules monitoring
2. Set up Cloud Logging for suspicious activities
3. Configure alerts for:
   - Multiple failed login attempts
   - Unusual data access patterns
   - Large file uploads
   - Rate limit violations

### Incident Response Plan
1. **If credentials are exposed**:
   - Immediately rotate all affected credentials
   - Review access logs for unauthorized usage
   - Update security rules if needed
   - Document the incident

2. **If unauthorized access is detected**:
   - Disable affected user accounts
   - Review and revoke access tokens
   - Analyze security rules for vulnerabilities
   - Implement additional restrictions

## 📚 Additional Resources

- [Firebase Security Checklist](https://firebase.google.com/docs/security-checklist)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)

## 🤝 Contributing

When contributing to this project:
1. Never commit sensitive information
2. Run security linters before submitting PRs
3. Follow the security guidelines in this document
4. Report security vulnerabilities privately to the maintainers

---

Remember: Security is an ongoing process. Regularly review and update these security measures as your application evolves.