# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the GDG Community Companion project. ADRs document important architectural decisions made during the development of the project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences. Each ADR describes a single decision and its rationale.

## ADR Index

### Platform and Infrastructure
- [ADR-001: Use Firebase as Primary Platform](./001-firebase-platform.md) - Why we chose Firebase for hosting, auth, and database
- [ADR-002: Use Node.js for Cloud Functions](./002-nodejs-cloud-functions.md) - Decision to use Node.js instead of Python for serverless functions
- [ADR-008: Firebase Deployment Pipeline](./008-deployment-pipeline.md) - Deployment strategy using Firebase CLI

### Data and Storage
- [ADR-003: Use Pinecone for Vector Database](./003-pinecone-vector-database.md) - Choice of Pinecone for semantic search and embeddings

### Security and Authentication
- [ADR-004: Mock Authentication for Development](./004-authentication-strategy.md) - Development authentication strategy
- [ADR-005: Firestore Security Rules Design](./005-security-rules-design.md) - Role-based security implementation

### Integrations
- [ADR-006: Social Platform Integration Strategy](./006-social-platform-integrations.md) - LinkedIn and Bluesky integration approach

### Configuration
- [ADR-007: Environment Configuration Strategy](./007-environment-configuration.md) - Environment file hierarchy and management

### Repository and Security Strategy
- [ADR-009: Public-Private Repository Strategy](./009-public-private-repository-strategy.md) - Dual repository approach for security
- [ADR-010: API Key Security Incident Response](./010-api-key-security-incident.md) - Handling exposed credentials

## ADR Template

When creating a new ADR, use this template:

```markdown
# ADR-XXX: [Decision Title]

## Status
[Accepted|Superseded|Deprecated|Rejected]

## Context
[Describe the issue motivating this decision, and any context that influences or constrains the decision]

## Decision
[Describe our response to these forces]

## Consequences
[Describe the resulting context, after applying the decision. All consequences should be listed here, not just the "positive" ones]

### Positive
[Positive consequences]

### Negative
[Negative consequences]

### Neutral
[Neutral consequences]
```

## Contributing

When making significant architectural decisions:
1. Create a new ADR using the template above
2. Number it sequentially (e.g., ADR-009)
3. Add it to this index
4. Reference it in relevant code and documentation