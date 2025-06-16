# ADR-008: Firebase Deployment Pipeline

## Status
Accepted

## Context
We needed to establish a deployment process that:
- Ensures consistent deployments
- Minimizes downtime
- Supports rollbacks
- Handles all Firebase services
- Works for both development and production

## Decision
We use Firebase CLI for deployment with:
- Single command deployment: `firebase deploy`
- Service-specific deployments when needed
- Environment-based configuration
- Pre-deployment validation

## Deployment Process
1. Build React app: `npm run build`
2. Deploy all services: `firebase deploy`
3. Or deploy specific services:
   - `firebase deploy --only hosting`
   - `firebase deploy --only functions`
   - `firebase deploy --only firestore:rules`

## Consequences

### Positive
- Simple deployment process
- Atomic deployments for most services
- Built-in rollback capabilities
- Preview channels for testing
- Automatic SSL certificates

### Negative
- Limited CI/CD integration options
- Manual process without automation
- No built-in staging environment
- Deployment requires CLI access

### Future Improvements
- GitHub Actions for automated deployment
- Preview deployments for PRs
- Automated testing before deployment
- Blue-green deployment strategy
- Infrastructure as Code with Firebase Extensions