---
inclusion: fileMatch
fileMatchPattern: '**/components/**/*.jsx'
---

# React Component Patterns

## Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // 3. Event handlers
  const handleEvent = () => {
    // handler logic
  };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// PropTypes validation
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

## Styling with TailwindCSS

Use utility classes for styling:

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

## Animations with Framer Motion

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Accessibility Requirements

- Minimum 44x44px touch targets for mobile
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators

```jsx
<button
  className="min-w-[44px] min-h-[44px]"
  aria-label="Close notification"
  onClick={handleClose}
>
  <CloseIcon />
</button>
```

## State Management

- Local state: `useState` for component-specific state
- Shared state: Context API or prop drilling
- Server state: React Query or custom hooks with fetch

## Error Boundaries

Wrap components that might error:

```jsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

## Loading States

Always handle loading states:

```jsx
{isLoading ? (
  <LoadingSkeleton />
) : (
  <Content data={data} />
)}
```

## Conditional Rendering

```jsx
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

## Component Organization

```
/components
  /ComponentName
    ComponentName.jsx
    ComponentName.test.js
    ComponentName.property.test.js
```

Or flat structure for simple components:

```
/components
  ComponentName.jsx
  ComponentName.test.js
```
