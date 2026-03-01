---
inclusion: fileMatch
fileMatchPattern: '**/*.test.js'
---

# Testing Guidelines

## Test Structure

### Backend Tests (Jest)
- Location: `backend/src/**/*.test.js`
- Run: `npm test` in backend directory
- Configuration: Jest with Node environment

### Frontend Tests (Vitest)
- Location: `frontend/src/**/*.test.js`
- Run: `npm test` in frontend directory
- Configuration: Vitest with jsdom environment

## Property-Based Testing

Use fast-check for property-based tests:

```javascript
import fc from 'fast-check';

fc.assert(
  fc.property(
    fc.string(), // arbitrary generator
    (input) => {
      // property that should always hold
      return someFunction(input).length >= 0;
    }
  )
);
```

## Test Naming Conventions

- Unit tests: `ComponentName.test.js`
- Integration tests: `ComponentName.integration.test.js`
- Property tests: `ComponentName.property.test.js`
- E2E tests: `ComponentName.e2e.test.js`

## Common Test Patterns

### Testing React Components
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('component renders correctly', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Testing API Endpoints
```javascript
const response = await request(app)
  .get('/api/endpoint')
  .expect(200);
  
expect(response.body).toHaveProperty('data');
```

## Test Coverage Goals

- Aim for 80%+ coverage on critical paths
- 100% coverage on business logic (services)
- Property tests for data validation and transformations
- Integration tests for API endpoints
- E2E tests for critical user flows

## Running Tests

```bash
# Backend
cd backend
npm test                    # Run all tests
npm test -- --coverage      # With coverage

# Frontend  
cd frontend
npm test                    # Run all tests
npm test -- --coverage      # With coverage
```
