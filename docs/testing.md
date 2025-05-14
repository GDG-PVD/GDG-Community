# Testing Guide

This document outlines the testing infrastructure and practices for the GDG Community Companion project.

## Overview

The GDG Community Companion uses a comprehensive testing strategy including:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test interactions between components
3. **UI Tests**: Test React components and user interfaces
4. **End-to-End Tests**: Test complete flows from user input to final output

## Test Structure

Tests are organized in the `tests/` directory with the following structure:

```
tests/
├── unit/                # Unit tests
│   ├── agents/          # Tests for agent components
│   ├── integrations/    # Tests for integration components
│   ├── knowledge/       # Tests for knowledge components
│   └── ui/              # Tests for UI components
├── integration/         # Integration tests
│   ├── agents/          # Tests for agent integration flows
│   ├── integrations/    # Tests for platform integration flows
│   └── knowledge/       # Tests for knowledge system flows
├── e2e/                 # End-to-end tests
└── conftest.py          # Shared fixtures and configurations
```

## Test Tools

The project uses the following testing tools:

- **Python Tests**:
  - `pytest`: Main testing framework
  - `pytest-asyncio`: For testing async code
  - `pytest-cov`: For code coverage reporting
  - `unittest.mock`: For mocking dependencies

- **UI Tests**:
  - React Testing Library: For testing React components
  - Jest: JavaScript testing framework

- **Quality Tools**:
  - `black`: Code formatting
  - `isort`: Import sorting
  - `mypy`: Type checking
  - `ruff`: Linting

## Running Tests

To run the tests, use the following commands:

### Python Tests

```bash
# Run all Python tests
pytest

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/

# Run with coverage report
pytest --cov=src --cov-report=term

# Run specific test file
pytest tests/unit/agents/test_content_agent.py

# Run specific test
pytest tests/unit/agents/test_content_agent.py::TestContentAgent::test_generate_social_post
```

### UI Tests

```bash
# Run UI tests
cd src/ui
npm test

# Run with no watch mode (for CI)
npm test -- --watchAll=false
```

### Linting

```bash
# Run black formatter
black src tests

# Run import sorting
isort src tests

# Run type checking
mypy src

# Run code linting
ruff src tests
```

## Testing Best Practices

### General Guidelines

1. **Test Isolation**: Each test should be independent and not rely on the state from previous tests
2. **Use Fixtures**: Use fixtures to set up common test data and mock objects
3. **Mock External Services**: Use mocks for external services (API calls, databases)
4. **Test Coverage**: Aim for high test coverage, especially for critical business logic
5. **Descriptive Test Names**: Use clear, descriptive names for test functions

### Python Testing

1. **Arrange-Act-Assert Pattern**:
   - Arrange: Set up test data and dependencies
   - Act: Call the function or method being tested
   - Assert: Verify the result matches expectations

2. **Test Both Success and Failure Cases**:
   - Test normal operation and edge cases
   - Test error handling and validation

3. **Use Proper Assertions**:
   - Use specific assertions (e.g., `assert_called_with` instead of just `assert`)
   - Include descriptive error messages

### UI Testing

1. **Test Behavior, Not Implementation**:
   - Focus on user interactions and outcomes
   - Use data-testid attributes for reliable selection

2. **Test Accessibility**:
   - Ensure UI components are accessible
   - Test keyboard navigation and screen reader compatibility

3. **Snapshot Testing**:
   - Use snapshot tests for UI components
   - Update snapshots when the UI changes intentionally

## Continuous Integration

The project uses GitHub Actions for continuous integration. The workflow:

1. Runs on every push to main and pull requests
2. Executes unit tests, integration tests, and UI tests
3. Generates code coverage reports
4. Runs linting and type checking

## Mocks and Fixtures

The `conftest.py` file provides common fixtures for testing:

- Mock implementations of external services (LinkedIn, Bluesky)
- Mock implementations of internal services (EmbeddingService, VectorStore)
- Sample data for testing (event data, templates, brand voice)

Use these fixtures in your tests to ensure consistent test data and avoid hitting real services.

## Adding New Tests

When adding new functionality to the project:

1. Add unit tests for individual functions and methods
2. Add integration tests for interactions between components
3. Update existing tests if you modify existing functionality
4. Ensure all tests pass before submitting a pull request

## Code Coverage

The project uses `pytest-cov` to generate code coverage reports. The CI pipeline includes coverage reports in XML format for Codecov integration.

To generate an HTML coverage report locally:

```bash
pytest --cov=src --cov-report=html
```

Then open `htmlcov/index.html` in your browser to see a detailed coverage report.