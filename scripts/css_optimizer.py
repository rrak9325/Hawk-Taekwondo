#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSS Optimizer
Finds duplicate CSS rules and suggests optimizations
"""

import re
import sys
from pathlib import Path
from collections import defaultdict

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def parse_css_file(file_path):
    """Parse CSS file and extract rules"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Find all rules
    rules = re.findall(r'([^{]+)\{([^}]+)\}', content)
    
    return rules

def analyze_css(css_dir='frontend/src/styles'):
    """Analyze CSS files for optimization opportunities"""
    css_path = Path(css_dir)
    
    if not css_path.exists():
        print(f"Error: {css_dir} not found")
        return
    
    all_rules = []
    property_usage = defaultdict(int)
    duplicate_rules = defaultdict(list)
    
    # Scan all CSS files
    css_files = list(css_path.rglob('*.css'))
    
    for file_path in css_files:
        rules = parse_css_file(file_path)
        
        for selector, properties in rules:
            selector = selector.strip()
            properties = properties.strip()
            
            all_rules.append((selector, properties, file_path))
            
            # Count property usage
            props = re.findall(r'([\w-]+)\s*:', properties)
            for prop in props:
                property_usage[prop] += 1
            
            # Find duplicates
            rule_key = f"{selector}:{properties}"
            duplicate_rules[rule_key].append(file_path)
    
    # Report
    print("\n" + "="*60)
    print("🎨 CSS OPTIMIZER")
    print("="*60)
    
    print(f"\n📊 Stats:")
    print(f"  Files scanned: {len(css_files)}")
    print(f"  Total rules: {len(all_rules)}")
    print(f"  Unique properties: {len(property_usage)}")
    
    # Most used properties
    print(f"\n🔝 Top 10 Most Used Properties:")
    for prop, count in sorted(property_usage.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {prop}: {count} times")
    
    # Duplicate rules
    duplicates = {k: v for k, v in duplicate_rules.items() if len(v) > 1}
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate rules:")
        for i, (rule, files) in enumerate(list(duplicates.items())[:5], 1):
            selector, props = rule.split(':', 1)
            print(f"\n  {i}. {selector}")
            print(f"     Properties: {props[:50]}...")
            print(f"     Found in {len(files)} files")
    
    # Optimization suggestions
    print(f"\n💡 Optimization Suggestions:")
    
    suggestions = []
    
    # Check for repeated colors
    colors = re.findall(r'#[0-9a-fA-F]{3,6}', str(all_rules))
    color_counts = defaultdict(int)
    for color in colors:
        color_counts[color] += 1
    
    repeated_colors = {c: count for c, count in color_counts.items() if count > 5}
    if repeated_colors:
        suggestions.append(f"  • {len(repeated_colors)} colors used 5+ times - consider CSS variables")
        for color, count in sorted(repeated_colors.items(), key=lambda x: x[1], reverse=True)[:3]:
            suggestions.append(f"    - {color}: {count} times")
    
    # Check for repeated values
    transitions = [r for r in all_rules if 'transition' in r[1].lower()]
    if len(transitions) > 10:
        suggestions.append(f"  • {len(transitions)} transition rules - consider a utility class")
    
    animations = [r for r in all_rules if 'animation' in r[1].lower()]
    if len(animations) > 10:
        suggestions.append(f"  • {len(animations)} animation rules - consider consolidating")
    
    if suggestions:
        for suggestion in suggestions:
            print(suggestion)
    else:
        print("  ✓ CSS looks well optimized!")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    analyze_css()
