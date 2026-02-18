#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Performance Report Generator
Combines all optimization checks into one report
"""

import subprocess
import sys
from datetime import datetime

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def run_script(script_name, description):
    """Run a Python script and capture output"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            [sys.executable, f"scripts/{script_name}"],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=30
        )
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error running {script_name}: {e}")
        return False

def generate_report():
    """Generate comprehensive performance report"""
    print("\n" + "="*60)
    print("🚀 COMPREHENSIVE PERFORMANCE REPORT")
    print("="*60)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run all checks
    checks = [
        ("analyze_bundle.py", "Bundle Size Analysis"),
        ("unused_code_finder.py", "Unused Code Detection"),
        ("css_optimizer.py", "CSS Optimization Check"),
        ("dependency_checker.py", "Dependency Analysis"),
    ]
    
    results = {}
    for script, description in checks:
        results[script] = run_script(script, description)
    
    # Summary
    print("\n" + "="*60)
    print("📋 SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"\nChecks completed: {passed}/{total}")
    
    for script, success in results.items():
        status = "✓" if success else "✗"
        print(f"  {status} {script}")
    
    print("\n💡 Next Steps:")
    print("  1. Review warnings and suggestions above")
    print("  2. Optimize images before deployment")
    print("  3. Remove unused code if safe")
    print("  4. Consider CSS consolidation")
    print("  5. Update outdated dependencies")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    generate_report()
