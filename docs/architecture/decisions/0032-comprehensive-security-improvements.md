# ADR-032: Comprehensive Security Improvements

## Status
Accepted

## Context
Following a review of security best practices from the Redwell ENV_BEST_PRACTICES.md document, we identified several security vulnerabilities in our codebase:
1. Hardcoded API keys in test files
2. No automated secret scanning in CI/CD
3. Complex environment file structure
4. Lack of pre-commit security checks

These issues pose significant security risks and violate industry best practices for secret management.

## Decision
We have implemented four comprehensive security improvements:

### 1. Environment Variables for Test Files
- Created centralized `firebase.test.config.ts` for test configurations
- Updated all test files to use environment variables or demo values
- Removed all hardcoded API keys from:
  - `storage-test.html`
  - `storage-test-esm.html`
  - `v10-storage-test.html`
  - `test-storage-module.js`
  - `auth-storage-test.html`
  - `bundletest.js`

### 2. Pre-commit Hooks with Gitleaks
- Added comprehensive `.pre-commit-config.yaml` with:
  - Gitleaks for secret detection
  - File size limits
  - Trailing whitespace removal
  - CodeQL security analysis
  - Custom API key pattern detection
- Created installation script for easy setup

### 3. Simplified Two-File Environment Structure
- Adopted Redwell's approach: `.env.example` + `.env.local`
- Created migration scripts to consolidate environment files
- Updated documentation to reflect new structure
- Removed unnecessary environment file variations

### 4. CI/CD Security Scanning
- Added GitHub Actions workflow for automated security scanning
- Integrated multiple security tools:
  - Gitleaks for secret scanning
  - Trivy for vulnerability scanning
  - CodeQL for code analysis
  - Custom regex patterns for API keys
- Runs on all pull requests and pushes

## Consequences

### Positive
- **Enhanced Security**: No hardcoded secrets in codebase
- **Automated Protection**: Pre-commit and CI/CD prevent accidental commits
- **Simplified Management**: Two-file structure reduces confusion
- **Compliance**: Follows industry best practices
- **Developer Experience**: Clear structure and automated checks

### Negative
- **Initial Setup**: Developers need to install pre-commit hooks
- **CI/CD Time**: Security scans add ~2-3 minutes to pipeline
- **Migration Effort**: Existing deployments need environment file updates

### Neutral
- **Learning Curve**: Team needs to understand new security practices
- **Tool Dependencies**: Requires Gitleaks and pre-commit installation

## Implementation Details

### Test Configuration
```typescript
// src/ui/src/config/firebase.test.config.ts
export const getTestFirebaseConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 
            (isDevelopment || isTest ? "demo-api-key" : ""),
    // ... other config
  };
};
```

### Pre-commit Configuration
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks
```

### GitHub Actions
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

## Related ADRs
- ADR-010: Environment Configuration Strategy
- ADR-012: Public-Private Repository Strategy
- ADR-013: API Key Security Incident Response

## References
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Pre-commit Framework](https://pre-commit.com/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- Redwell ENV_BEST_PRACTICES.md