#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unused Code Finder
Finds potentially unused imports, functions, and components
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def find_exports(file_path):
    """Find all exports in a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    exports = []
    
    # export default function/const/class Name
    exports.extend(re.findall(r'export\s+default\s+(?:function|const|class)\s+(\w+)', content))
    
    # export function/const/class Name
    exports.extend(re.findall(r'export\s+(?:function|const|class)\s+(\w+)', content))
    
    # export { Name }
    exports.extend(re.findall(r'export\s+\{\s*(\w+)', content))
    
    return exports

def find_imports(file_path):
    """Find all imports in a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    imports = []
    
    # import Name from
    imports.extend(re.findall(r'import\s+(\w+)\s+from', content))
    
    # import { Name } from
    imports.extend(re.findall(r'import\s+\{[^}]*\b(\w+)\b[^}]*\}', content))
    
    return imports

def find_unused_code(src_dir='frontend/src'):
    """Find potentially unused exports"""
    src_path = Path(src_dir)
    
    if not src_path.exists():
        print(f"Error: {src_dir} not found")
        return
    
    # Collect all exports and imports
    all_exports = defaultdict(list)  # {name: [files]}
    all_imports = defaultdict(int)   # {name: count}
    
    # Scan all JS/JSX files
    for file_path in src_path.rglob('*.jsx'):
        if 'node_modules' in str(file_path):
            continue
        
        # Find exports
        exports = find_exports(file_path)
        for export in exports:
            all_exports[export].append(str(file_path))
        
        # Find imports
        imports = find_imports(file_path)
        for imp in imports:
            all_imports[imp] += 1
    
    # Find unused exports
    unused = []
    for name, files in all_exports.items():
        if name not in all_imports or all_imports[name] == 0:
            unused.append((name, files))
    
    # Report
    print("\n" + "="*60)
    print("🔍 UNUSED CODE FINDER")
    print("="*60)
    
    if unused:
        print(f"\n⚠️  Found {len(unused)} potentially unused exports:\n")
        for name, files in sorted(unused):
            print(f"  • {name}")
            for file in files:
                rel_path = Path(file).relative_to(src_path)
                print(f"    └─ {rel_path}")
    else:
        print("\n✓ No unused exports found!")
    
    print("\n" + "="*60)
    print("\n💡 Note: This is a basic check. Some exports may be:")
    print("   - Used in HTML/CSS")
    print("   - Used dynamically")
    print("   - Entry points (like App.jsx)")
    print("   - Intentionally exported for future use")

if __name__ == "__main__":
    find_unused_code()
