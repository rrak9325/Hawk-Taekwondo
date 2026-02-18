# Performance Optimizations

## Viewport-Based Lazy Rendering

The site now uses **viewport-based lazy rendering** to reduce lag and memory usage. Components only render when they're in or near the viewport, and completely unmount when scrolled away.

### How It Works

1. **LazySection Component** - Wraps sections that should only render when visible
2. **useViewportRender Hook** - Tracks when elements enter/exit viewport using IntersectionObserver
3. **Automatic Unmounting** - Components unmount when not visible, freeing up memory

### Benefits

- **Reduced Memory Usage** - Only visible components are in memory
- **Faster Initial Load** - Hero loads first, other sections load as you scroll
- **Smoother Scrolling** - Less DOM to manage = smoother performance
- **Mobile Optimized** - Works on all devices (Desktop, Mobile, iOS, Android)

### Usage Example

```jsx
import LazySection from '../components/LazySection'

// Wrap any section with LazySection
<LazySection rootMargin="300px">
  <YourComponent />
</LazySection>
```

### Configuration

- `rootMargin` - How far before viewport to start rendering (default: 200px)
- `keepMounted` - Keep component mounted after first render (default: false)

## Other Optimizations

1. **Adaptive Performance Detection** - Detects device RAM, CPU, connection speed
2. **Memory Leak Fixes** - All event listeners properly cleaned up
3. **Memoization** - Prevents unnecessary re-renders
4. **Smooth Animations** - Lowkey, subtle animations that respect reduced-motion
5. **Code Splitting** - Lazy-loaded routes and components

## Running the Site

```bash
# Start both backend and frontend
npm start

# Build for production
npm run build:frontend
```

## Build Stats

- **Total Size**: 309.85 KB (100.74 KB gzipped)
- **CSS Size**: 71.93 KB (12.14 KB gzipped)
- **Optimized for**: All devices, all connection speeds
