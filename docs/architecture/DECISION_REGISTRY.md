# Architecture Decision Registry

This registry provides a searchable index of all architectural decisions made for the GDG Community Companion platform.

## Current ADRs

| ID | Title | Date | Status | Link | Tags |
|---|---|---|---|---|---|
| ADR-001 | Three-Layer Knowledge Architecture | 2025-05-01 | Accepted | [ADR-001](./decisions/0001-three-layer-knowledge-architecture.md) | architecture, knowledge, ai |
| ADR-002 | Multi-Agent Architecture with ADK | 2025-05-01 | Accepted | [ADR-002](./decisions/0002-multi-agent-architecture.md) | ai, agents, google-adk, architecture |
| ADR-003 | Knowledge-Integrated Agent System | 2025-05-01 | Accepted | [ADR-003](./decisions/0003-knowledge-integrated-agent-system.md) | ai, agents, knowledge, integration |
| ADR-004 | Firebase as Primary Platform | 2025-05-05 | Accepted | [ADR-004](./decisions/0004-firebase-platform.md) | platform, infrastructure, firebase |
| ADR-005 | Node.js for Cloud Functions | 2025-05-05 | Accepted | [ADR-005](./decisions/0005-nodejs-cloud-functions.md) | backend, nodejs, functions |
| ADR-006 | Pinecone for Vector Database | 2025-05-05 | Accepted | [ADR-006](./decisions/0006-pinecone-vector-database.md) | database, vector, ai, pinecone |
| ADR-007 | Authentication Strategy | 2025-05-08 | Accepted | [ADR-007](./decisions/0007-authentication-strategy.md) | security, auth, firebase |
| ADR-008 | Firestore Security Rules Design | 2025-05-08 | Accepted | [ADR-008](./decisions/0008-security-rules-design.md) | security, firestore, rbac |
| ADR-009 | Social Platform Integration Strategy | 2025-05-10 | Accepted | [ADR-009](./decisions/0009-social-platform-integration-strategy.md) | integration, social-media, linkedin, bluesky |
| ADR-010 | Environment Configuration Strategy | 2025-05-10 | Accepted | [ADR-010](./decisions/0010-environment-configuration-strategy.md) | configuration, environment, security |
| ADR-011 | Firebase Deployment Pipeline | 2025-05-12 | Accepted | [ADR-011](./decisions/0011-deployment-pipeline.md) | deployment, ci-cd, firebase |
| ADR-012 | Public-Private Repository Strategy | 2025-05-12 | Accepted | [ADR-012](./decisions/0012-public-private-repository-strategy.md) | repository, git, security |
| ADR-028 | Google ADK Best Practices Implementation | 2025-06-16 | Accepted | [ADR-028](./decisions/0028-adk-best-practices-implementation.md) | ai, agents, google-adk, implementation, best-practices |
| ADR-034 | Stage 1 Enhanced Memory Implementation | 2025-06-16 | Accepted | [ADR-034](./decisions/0034-stage-1-enhanced-memory-implementation.md) | ai, memory, agentic-ai, episodic, semantic, reflection |
| ADR-035 | Three-Layer Knowledge Architecture Implementation | 2025-06-16 | Accepted | [ADR-035](./decisions/0035-three-layer-knowledge-architecture-implementation.md) | knowledge, architecture, implementation, semantic, kinetic, dynamic |
| ADR-036 | Open Source Feature Transfer | 2025-06-16 | Accepted | [ADR-036](./decisions/0036-open-source-feature-transfer.md) | open-source, transfer, security, documentation, community |

## Filter by Tags

### AI & Agents
- [ADR-001: Three-Layer Knowledge Architecture](./decisions/0001-three-layer-knowledge-architecture.md)
- [ADR-002: Multi-Agent Architecture with ADK](./decisions/0002-multi-agent-architecture.md)
- [ADR-003: Knowledge-Integrated Agent System](./decisions/0003-knowledge-integrated-agent-system.md)
- [ADR-006: Pinecone for Vector Database](./decisions/0006-pinecone-vector-database.md)
- [ADR-028: Google ADK Best Practices Implementation](./decisions/0028-adk-best-practices-implementation.md)
- [ADR-034: Stage 1 Enhanced Memory Implementation](./decisions/0034-stage-1-enhanced-memory-implementation.md)

### Knowledge Architecture
- [ADR-001: Three-Layer Knowledge Architecture](./decisions/0001-three-layer-knowledge-architecture.md)
- [ADR-003: Knowledge-Integrated Agent System](./decisions/0003-knowledge-integrated-agent-system.md)
- [ADR-035: Three-Layer Knowledge Architecture Implementation](./decisions/0035-three-layer-knowledge-architecture-implementation.md)

### Platform & Infrastructure
- [ADR-004: Firebase Platform](./decisions/0004-firebase-platform.md)
- [ADR-005: Node.js Cloud Functions](./decisions/0005-nodejs-cloud-functions.md)
- [ADR-006: Pinecone for Vector Database](./decisions/0006-pinecone-vector-database.md)
- [ADR-011: Deployment Pipeline](./decisions/0011-deployment-pipeline.md)

### Security & Authentication
- [ADR-007: Authentication Strategy](./decisions/0007-authentication-strategy.md)
- [ADR-008: Security Rules Design](./decisions/0008-security-rules-design.md)
- [ADR-010: Environment Configuration](./decisions/0010-environment-configuration-strategy.md)
- [ADR-012: Repository Strategy](./decisions/0012-public-private-repository-strategy.md)
- [ADR-036: Open Source Feature Transfer](./decisions/0036-open-source-feature-transfer.md)

### Integration & Social Media
- [ADR-009: Social Platform Integration](./decisions/0009-social-platform-integration-strategy.md)

### Implementation & Best Practices
- [ADR-028: Google ADK Best Practices Implementation](./decisions/0028-adk-best-practices-implementation.md)
- [ADR-034: Stage 1 Enhanced Memory Implementation](./decisions/0034-stage-1-enhanced-memory-implementation.md)
- [ADR-035: Three-Layer Knowledge Architecture Implementation](./decisions/0035-three-layer-knowledge-architecture-implementation.md)

### Community & Open Source
- [ADR-012: Public-Private Repository Strategy](./decisions/0012-public-private-repository-strategy.md)
- [ADR-036: Open Source Feature Transfer](./decisions/0036-open-source-feature-transfer.md)

## Status Definitions

- **Accepted**: The decision is currently active and should be followed
- **Superseded**: The decision has been replaced by a newer ADR
- **Deprecated**: The decision is no longer recommended but may still be in use
- **Rejected**: The decision was not accepted after review