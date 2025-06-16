# ADR-002: Use Node.js for Cloud Functions

## Status
Accepted

## Context
Initially, we attempted to use Python for Cloud Functions to leverage existing AI/ML libraries and maintain consistency with the agent system. However, we encountered deployment issues:
- Firebase Functions runtime required Python 3.12, but our system had Python 3.13
- Python runtime support in Firebase Functions has limitations
- Deployment complexity increased with Python dependencies

## Decision
We will use Node.js (runtime nodejs20) for all Cloud Functions, including:
- Content generation endpoints
- Social media integrations
- Webhook handlers
- Health check endpoints

## Consequences

### Positive
- First-class support in Firebase Functions
- Faster deployment times
- Better integration with Firebase SDK
- Consistent with frontend technology stack
- Extensive npm ecosystem for integrations

### Negative
- Need to rewrite Python-based agent logic in JavaScript
- Potential loss of some Python-specific ML libraries
- Team needs JavaScript expertise for backend development

### Mitigation
- Use Vertex AI and Gemini APIs for ML capabilities
- Leverage Google's Node.js client libraries
- Share common utilities between frontend and backend