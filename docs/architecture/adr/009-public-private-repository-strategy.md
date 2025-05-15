# ADR-009: Public-Private Repository Strategy

**Date**: May 15, 2025

**Status**: Accepted

## Context

During deployment, a Firebase API key was exposed in the public repository. While Firebase API keys are designed to be public (protected by security rules), exposing production configurations in a public repository creates security risks and maintenance challenges.

## Decision

We will maintain two separate repositories:

### 1. Public Template Repository (gdg-community)
- Contains all source code, architecture, and documentation
- Excludes sensitive environment configurations
- Uses placeholder values for all API keys and secrets
- Serves as a template for other GDG chapters
- Open source under MIT license

### 2. Private Implementation Repository (gdg-community-private)
- Contains production environment configurations
- Includes actual API keys, OAuth credentials, and chapter-specific settings
- Used for actual deployment to production
- Private to chapter organizers only
- Contains chapter-specific customizations

## Consequences

### Positive
- Security: Sensitive credentials never exposed publicly
- Flexibility: Chapters can customize without affecting template
- Maintenance: Clean separation of concerns
- Sharing: Other chapters can easily fork and implement

### Negative
- Complexity: Must maintain two repositories
- Synchronization: Need to keep codebases in sync
- Documentation: Must clearly document the dual-repo approach

## Implementation

1. Public repository contains `.env.example` files
2. Private repository contains actual `.env` files
3. Private repository is initialized from public template
4. Code changes go to public repo first, then synced to private
5. Configuration changes stay in private repo only

## Related ADRs
- ADR-007: Environment Configuration Hierarchy
- ADR-010: API Key Security Incident Response