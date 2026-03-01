---
inclusion: fileMatch
fileMatchPattern: '**/config/database.js'
---

# Database Operations

## File-Based JSON Database

The application uses a file-based JSON database located at:
```
backend/public/mockData.json
```

## Database Configuration

Location: `backend/src/config/database.js`

Key functions:
- `readDatabase()` - Read entire database
- `writeDatabase(data)` - Write entire database
- `getCollection(name)` - Get specific collection
- `updateCollection(name, data)` - Update specific collection

## Database Schema

```json
{
  "notifications": [
    {
      "id": "uuid-v4",
      "title": "string",
      "message": "string",
      "type": "info|success|warning|error",
      "scheduledDate": "ISO 8601 date or null",
      "createdAt": "ISO 8601 date",
      "isRead": false
    }
  ],
  "classes": [...],
  "instructors": [...],
  "testimonials": [...]
}
```

## Important Considerations

### File System Sync
Add delay after writes to ensure file system sync:

```javascript
await writeDatabase(data);
await new Promise(resolve => setTimeout(resolve, 100));
```

### Error Handling
Always wrap database operations in try-catch:

```javascript
try {
  const data = await readDatabase();
  // operations
  await writeDatabase(data);
} catch (error) {
  console.error('Database error:', error);
  throw new Error('Database operation failed');
}
```

### Data Validation
Validate data before writing:

```javascript
if (!Array.isArray(data.notifications)) {
  throw new Error('Invalid data structure');
}
```

### Concurrent Access
The file-based approach has limitations with concurrent writes. For production, consider:
- Database locking mechanisms
- Migration to proper database (MongoDB, PostgreSQL)
- Queue-based write operations

## Common Operations

### Create
```javascript
const newItem = {
  id: uuidv4(),
  ...itemData,
  createdAt: new Date().toISOString()
};
collection.push(newItem);
await writeDatabase(data);
```

### Read
```javascript
const data = await readDatabase();
const item = data.collection.find(item => item.id === id);
```

### Update
```javascript
const data = await readDatabase();
const index = data.collection.findIndex(item => item.id === id);
if (index !== -1) {
  data.collection[index] = { ...data.collection[index], ...updates };
  await writeDatabase(data);
}
```

### Delete
```javascript
const data = await readDatabase();
data.collection = data.collection.filter(item => item.id !== id);
await writeDatabase(data);
```

## Path Resolution

Always use correct relative paths:
```javascript
// From backend/src/config/database.js
const DB_PATH = path.join(__dirname, '../../public/mockData.json');
```

## Backup Strategy

Consider implementing:
- Automatic backups before writes
- Version history
- Rollback capability
