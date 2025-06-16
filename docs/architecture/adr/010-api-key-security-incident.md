# ADR-010: API Key Security Incident Response

**Date**: May 15, 2025

**Status**: Accepted

## Context

During the initial deployment process, a Firebase API key was exposed in the public GitHub repository. This triggered an automated GitGuardian security alert. While Firebase API keys are designed to be public-facing (with security enforced through Firebase Security Rules), the incident highlighted the need for better credential management practices.

## Decision

We implemented the following security measures:

1. **Immediate Response**
   - Removed the exposed API key from public repository
   - Regenerated new API key in Firebase Console
   - Applied domain restrictions to new API key
   - Deployed application with new credentials

2. **Long-term Strategy**
   - Adopted public-private repository strategy (see ADR-009)
   - Implemented environment file hierarchy for different deployment stages
   - Added security guidelines to documentation

## Technical Details

### API Key Configuration
- Firebase API keys are client-facing and meant to be public
- Security is enforced through:
  - Firebase Security Rules
  - Domain restrictions
  - Authentication requirements
  - CORS policies

### Environment File Structure
```
Public Repo:              Private Repo:
.env.example              .env
                         .env.local
                         .env.production
                         .env.production.local
```

## Consequences

### Positive
- Enhanced security posture
- Clear separation of public/private configurations
- Better documentation of security practices
- Compliance with security scanning tools

### Negative
- Added complexity in repository management
- Requires careful synchronization between repos
- Team members need access to both repositories

## Lessons Learned

1. Even "public" API keys should not be in public repos
2. Security scanning tools don't distinguish between truly secret and public-facing keys
3. Clear documentation prevents confusion about security practices
4. Environment configuration hierarchy is crucial for deployment

## References
- [Firebase API Keys Documentation](https://firebase.google.com/docs/projects/api-keys)
- [GitGuardian Security Best Practices](https://docs.gitguardian.com/)
- ADR-009: Public-Private Repository Strategy