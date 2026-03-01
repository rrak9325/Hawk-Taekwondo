---
inclusion: fileMatch
fileMatchPattern: '**/routes/*.js'
---

# API Conventions

## Endpoint Structure

All API endpoints follow REST conventions:

```
GET    /api/resource       - List all
GET    /api/resource/:id   - Get one
POST   /api/resource       - Create
PUT    /api/resource/:id   - Update
DELETE /api/resource/:id   - Delete
```

## Authentication

Protected routes require JWT token in Authorization header:

```javascript
Authorization: Bearer <token>
```

Middleware: `authMiddleware.js` validates tokens and attaches user to `req.user`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional detailed error info"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (valid token, insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Public vs Admin Endpoints

### Public Endpoints
- No authentication required
- Return only active/published content
- Filter by `scheduledDate` (null or <= now)

### Admin Endpoints
- Require authentication (`authMiddleware`)
- Return all content including scheduled/draft
- Full CRUD operations

## Example Route Definition

```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const controller = require('../controllers/resourceController');

// Public routes
router.get('/resource', controller.getAll);
router.get('/resource/:id', controller.getOne);

// Admin routes (protected)
router.post('/resource', authMiddleware, controller.create);
router.put('/resource/:id', authMiddleware, controller.update);
router.delete('/resource/:id', authMiddleware, controller.delete);

module.exports = router;
```

## Validation

- Use express-validator for input validation
- Validate in controller before passing to service
- Return 400 with validation errors

## Error Handling

- Use `errorMiddleware` for centralized error handling
- Throw errors in services, catch in controllers
- Log errors with context for debugging
