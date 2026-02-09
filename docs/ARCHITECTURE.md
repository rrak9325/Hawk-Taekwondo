# Architecture Overview

## Project Structure

```
hawk-taekwondo/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # UI components (no business logic)
│   │   ├── pages/           # Route-level components
│   │   ├── layouts/         # App shell, navigation
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls, external integrations
│   │   ├── api/             # HTTP client configuration
│   │   ├── store/           # State management
│   │   ├── utils/           # Pure functions, helpers
│   │   ├── constants/       # Configuration values
│   │   ├── assets/          # Static assets
│   │   └── styles/          # Stylesheets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── routes/          # API endpoint definitions
│   │   ├── services/        # Business logic layer
│   │   ├── models/          # Data access layer
│   │   ├── middlewares/     # Request/response processing
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── validators/      # Input validation
│   ├── package.json
│   └── server.js
├── shared/                   # Shared code between frontend/backend
│   ├── types/               # Common interfaces
│   └── constants/           # Shared constants
└── docs/                     # Documentation
```

## Data Flow

### Frontend → Backend
1. **UI Component** triggers action
2. **Service Layer** makes API call via HTTP client
3. **API Client** handles request/response/errors
4. **Backend Route** receives request
5. **Controller** validates and delegates to service
6. **Service** processes business logic
7. **Model** handles data access
8. Response flows back through the chain

### Backend Layers
- **Routes**: Define endpoints, apply middleware
- **Controllers**: Parse requests, call services, format responses
- **Services**: Business logic, data processing
- **Models**: Database operations, data validation
- **Middlewares**: Auth, validation, error handling

## Key Principles

### Separation of Concerns
- **Components**: UI only, no business logic
- **Services**: API calls and data transformation
- **Controllers**: HTTP handling only
- **Services**: Business logic only
- **Models**: Data access only

### Single Responsibility
- Each file has one clear purpose
- No mixed responsibilities
- Clear interfaces between layers

### Error Handling
- Consistent error responses
- Proper HTTP status codes
- Client-side error boundaries
- Server-side error middleware

### Security
- Authentication middleware
- Rate limiting
- Input validation
- CORS configuration
- File upload restrictions

## Technology Stack

### Frontend
- React 18 with hooks
- React Router for routing
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js with Express
- ES modules
- Sharp for image processing
- bcryptjs for password hashing
- File upload handling

### Development
- ESLint for code quality
- Concurrently for dev server orchestration
- Environment-based configuration