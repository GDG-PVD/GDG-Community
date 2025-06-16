# GitHub Issue Labels

This document defines the standard labels used in the GDG Community Companion repository for issue tracking and project management.

## Label Categories

### Issue Types
- `bug` - Something isn't working correctly
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `question` - Further information is requested
- `security` - Security-related issues or improvements

### Priority Levels
- `priority:critical` - Critical issues that block usage or cause data loss
- `priority:high` - High priority issues that significantly impact functionality
- `priority:medium` - Medium priority improvements and features
- `priority:low` - Low priority nice-to-have features

### Component Areas
- `frontend` - React/TypeScript UI components and pages
- `backend` - Node.js Cloud Functions and APIs
- `agents` - Python agent system and AI functionality
- `knowledge` - Knowledge management and three-layer architecture
- `memory` - Enhanced memory system and learning capabilities
- `social-media` - LinkedIn, Bluesky, and social platform integrations
- `auth` - Authentication and authorization
- `database` - Firestore and data storage
- `vector-db` - Pinecone vector database and embeddings
- `infrastructure` - Deployment, hosting, and infrastructure

### Status Labels
- `needs-triage` - New issues that need initial review
- `confirmed` - Bug confirmed and ready for work
- `in-progress` - Currently being worked on
- `blocked` - Blocked by external dependencies
- `ready-for-review` - Implementation ready for code review
- `ready-for-testing` - Ready for testing/QA
- `deployed` - Changes deployed to production

### Effort Estimation
- `effort:small` - Small effort (< 1 day)
- `effort:medium` - Medium effort (1-3 days)
- `effort:large` - Large effort (> 3 days)
- `effort:epic` - Epic requiring breakdown into smaller issues

### Skill Requirements
- `good-first-issue` - Good for newcomers to the project
- `help-wanted` - Community contributions welcome
- `advanced` - Requires deep understanding of the system
- `needs-design` - Requires UI/UX design work
- `needs-research` - Requires investigation or research

### Special Categories
- `breaking-change` - Changes that break backward compatibility
- `performance` - Performance-related improvements
- `accessibility` - Accessibility improvements
- `mobile` - Mobile-specific issues or features
- `testing` - Test-related improvements
- `refactoring` - Code refactoring and technical debt

### ADR Related
- `adr-required` - Issue requires an Architecture Decision Record
- `adr-0001` - Related to Three-Layer Knowledge Architecture
- `adr-0002` - Related to Multi-Agent Architecture
- `adr-0028` - Related to Google ADK Best Practices
- `adr-0034` - Related to Enhanced Memory Implementation
- `adr-0035` - Related to Knowledge Architecture Implementation
- `adr-0036` - Related to Open Source Feature Transfer

### Community
- `community-request` - Requested by the GDG community
- `gdg-organizer` - Specific to GDG organizer needs
- `chapter-specific` - Specific to certain GDG chapters
- `open-source` - Related to open source template features

## Label Usage Guidelines

### Issue Triage Process
1. New issues get `needs-triage` label
2. Maintainers add appropriate component and type labels
3. Priority is assigned based on impact and urgency
4. Effort estimation helps with sprint planning
5. Status labels track progress through development

### Pull Request Labels
- Use component labels to indicate affected areas
- Add `breaking-change` if PR introduces breaking changes
- Use `ready-for-review` when PR is complete
- Add effort estimation for planning purposes

### Project Management
- Use priority labels for backlog prioritization
- Component labels help with team assignment
- Status labels support kanban board workflow
- Effort labels assist with sprint capacity planning

## Recommended Label Sets

### For Bug Reports
```
bug, needs-triage, [component], [priority], [effort]
```

### For Feature Requests
```
enhancement, needs-triage, [component], [priority], [effort]
```

### For Community Contributions
```
help-wanted, good-first-issue, [component], [effort]
```

### For Architecture Changes
```
enhancement, adr-required, [component], priority:high, effort:large
```

## Color Coding

- **Red (#d73a49)**: Critical issues, bugs, breaking changes
- **Orange (#ff8c00)**: High priority, performance, security
- **Yellow (#ffeb3b)**: Medium priority, documentation, questions
- **Green (#28a745)**: Enhancements, good first issues, ready states
- **Blue (#0366d6)**: Component areas, infrastructure
- **Purple (#6f42c1)**: Advanced topics, ADRs, architecture
- **Gray (#6a737d)**: Status, effort, process labels

## Creating New Labels

When creating new labels:
1. Use consistent naming conventions (lowercase, hyphen-separated)
2. Choose appropriate colors based on the category
3. Add clear descriptions for label purpose
4. Update this documentation
5. Communicate changes to the team

## Automation

Consider setting up GitHub Actions to:
- Auto-apply labels based on file paths in PRs
- Move issues between project boards based on labels
- Notify relevant team members based on component labels
- Generate reports based on label analytics