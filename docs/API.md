# API Documentation

## Authentication Endpoints

### POST /api/login
Login with admin credentials.

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "session_token"
}
```

### POST /api/logout
Logout and invalidate session.

**Headers:** `Authorization: session_token`

**Response:**
```json
{
  "success": true
}
```

## Data Endpoints

### GET /api/data
Get school data (public endpoint).

**Response:**
```json
{
  "school": { ... },
  "programs": [ ... ],
  "instructors": [ ... ],
  ...
}
```

### POST /api/data
Update school data (requires auth).

**Headers:** `Authorization: session_token`

**Request:** Complete school data object

**Response:**
```json
{
  "success": true
}
```

## Upload Endpoints

### POST /api/upload
Upload and process media files (requires auth).

**Headers:** `Authorization: session_token`

**Request:** FormData with `file` field

**Response:**
```json
{
  "url": "/uploads/filename.webp",
  "type": "image",
  "originalSize": 1024000,
  "optimizedSize": 512000,
  "compressionRatio": "50.0",
  "format": "webp",
  "dimensions": "800x600",
  "filename": "filename.webp",
  "allFormats": [...]
}
```

### DELETE /api/file
Delete uploaded file (requires auth).

**Headers:** `Authorization: session_token`

**Request:**
```json
{
  "filePath": "/uploads/filename.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "deletedFiles": ["filename.jpg", "filename.webp"],
  "message": "Deleted 2 file(s)"
}
```

### POST /api/cleanup
Clean up orphaned files (requires auth).

**Headers:** `Authorization: session_token`

**Response:**
```json
{
  "success": true,
  "deletedCount": 5
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message"
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 413: Payload Too Large
- 429: Too Many Requests
- 500: Internal Server Error