#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dependency Checker
Checks for outdated, unused, or heavy npm packages
"""

import json
import subprocess
import sys
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def load_package_json(path='frontend/package.json'):
    """Load package.json"""
    with open(path, 'r') as f:
        return json.load(f)

def get_package_size(package_name):
    """Get package size from npm (requires npm)"""
    try:
        result = subprocess.run(
            ['npm', 'view', package_name, 'dist.unpackedSize'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            size = int(result.stdout.strip())
            return size
    except:
        pass
    return None

def check_dependencies(package_json_path='frontend/package.json'):
    """Check dependencies for issues"""
    pkg = load_package_json(package_json_path)
    
    deps = pkg.get('dependencies', {})
    dev_deps = pkg.get('devDependencies', {})
    
    print("\n" + "="*60)
    print("📦 DEPENDENCY CHECKER")
    print("="*60)
    
    print(f"\n📊 Stats:")
    print(f"  Dependencies: {len(deps)}")
    print(f"  Dev Dependencies: {len(dev_deps)}")
    
    # List all dependencies
    print(f"\n📚 Production Dependencies:")
    for name, version in sorted(deps.items()):
        print(f"  • {name}@{version}")
    
    print(f"\n🛠️  Dev Dependencies:")
    for name, version in sorted(dev_deps.items()):
        print(f"  • {name}@{version}")
    
    # Check for heavy packages (known ones)
    heavy_packages = {
        'moment': 'Consider using date-fns or dayjs (smaller)',
        'lodash': 'Consider lodash-es for tree-shaking',
        'axios': 'Consider native fetch API',
        'jquery': 'Consider removing (use vanilla JS)',
        'bootstrap': 'Consider Tailwind CSS (already using)',
    }
    
    print(f"\n⚠️  Optimization Opportunities:")
    found_issues = False
    
    for pkg_name, suggestion in heavy_packages.items():
        if pkg_name in deps:
            print(f"  • {pkg_name}: {suggestion}")
            found_issues = True
    
    # Check for duplicate functionality
    if 'axios' in deps and 'node-fetch' in deps:
        print(f"  • Both axios and node-fetch found - consider using one")
        found_issues = True
    
    if 'framer-motion' in deps and 'react-spring' in deps:
        print(f"  • Both framer-motion and react-spring found - consider using one")
        found_issues = True
    
    if not found_issues:
        print("  ✓ No obvious issues found!")
    
    # Suggestions
    print(f"\n💡 General Suggestions:")
    print("  • Run 'npm outdated' to check for updates")
    print("  • Run 'npm audit' to check for security issues")
    print("  • Use 'npm ls' to check for duplicate dependencies")
    print("  • Consider lazy loading heavy libraries")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    check_dependencies()
