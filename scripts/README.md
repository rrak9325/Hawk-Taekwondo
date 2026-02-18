# Optimization Scripts

Python scripts for build-time optimizations and code analysis.

## Setup

```bash
# Install Python dependencies
pip install -r scripts/requirements.txt
```

## Scripts

### 1. Image Optimization (`optimize_images.py`)

Compresses and resizes images before deployment.

**Usage:**
```bash
python scripts/optimize_images.py ./raw_images ./frontend/public/images --thumbnails
```

**What it does:**
- Resizes images to max 1920x1080
- Compresses to 85% quality JPEG
- Converts HEIC/HEIF to JPEG
- Creates thumbnails (400x400)
- Shows size savings

### 2. Bundle Analyzer (`analyze_bundle.py`)

Analyzes Vite build output and tracks bundle size over time.

**Usage:**
```bash
npm run analyze:bundle
```

**What it does:**
- Shows total bundle size
- Groups assets by type
- Lists top 10 largest files
- Warns about oversized files
- Tracks size history

### 3. Unused Code Finder (`unused_code_finder.py`)

Finds potentially unused exports and imports.

**Usage:**
```bash
npm run check:unused
```

**What it does:**
- Scans all JSX files
- Finds exports that aren't imported
- Lists potentially dead code
- Helps identify cleanup opportunities

### 4. CSS Optimizer (`css_optimizer.py`)

Analyzes CSS for optimization opportunities.

**Usage:**
```bash
npm run check:css
```

**What it does:**
- Finds duplicate CSS rules
- Identifies repeated colors/values
- Suggests CSS variables
- Recommends consolidation

### 5. Dependency Checker (`dependency_checker.py`)

Checks npm packages for issues.

**Usage:**
```bash
npm run check:deps
```

**What it does:**
- Lists all dependencies
- Identifies heavy packages
- Suggests lighter alternatives
- Finds duplicate functionality

### 6. Performance Report (`performance_report.py`)

Runs all checks and generates comprehensive report.

**Usage:**
```bash
npm run report:performance
```

**What it does:**
- Runs all optimization checks
- Combines results into one report
- Provides actionable next steps

## Quick Commands

```bash
# Image optimization
npm run optimize:images ./raw_images ./output

# Bundle analysis
npm run analyze:bundle

# Find unused code
npm run check:unused

# Check CSS
npm run check:css

# Check dependencies
npm run check:deps

# Full performance report
npm run report:performance
```

## When to Use

**Before deploying:**
```bash
npm run report:performance
```

**After adding dependencies:**
```bash
npm run check:deps
npm run analyze:bundle
```

**During cleanup:**
```bash
npm run check:unused
npm run check:css
```

**Processing new images:**
```bash
npm run optimize:images ./new_photos ./optimized
```

## Real Examples

### 1. Pre-deployment check
```bash
npm run report:performance
# Review all warnings
# Fix critical issues
# Deploy
```

### 2. Optimize new photos
```bash
python scripts/optimize_images.py ./raw_photos ./optimized --thumbnails
# Upload optimized versions to Cloudinary
```

### 3. Clean up unused code
```bash
npm run check:unused
# Review list
# Remove safe-to-delete exports
# Test thoroughly
```

### 4. Reduce bundle size
```bash
npm run analyze:bundle
# Check largest files
# Lazy load heavy components
# Remove unused dependencies
```
