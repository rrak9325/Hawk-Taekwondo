#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bundle Size Analyzer
Analyzes Vite build output and tracks bundle size over time
"""

import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def parse_build_output(dist_dir='frontend/dist'):
    """Parse Vite build output"""
    dist_path = Path(dist_dir)
    
    if not dist_path.exists():
        print("Error: dist directory not found. Run 'npm run build:frontend' first.")
        return None
    
    assets = []
    total_size = 0
    total_gzip = 0
    
    # Parse all files in dist/assets
    assets_dir = dist_path / 'assets'
    if assets_dir.exists():
        for file in assets_dir.iterdir():
            if file.is_file():
                size = file.stat().st_size
                total_size += size
                
                assets.append({
                    'name': file.name,
                    'size': size,
                    'size_kb': round(size / 1024, 2),
                    'type': get_file_type(file.name)
                })
    
    return {
        'timestamp': datetime.now().isoformat(),
        'total_size': total_size,
        'total_size_mb': round(total_size / (1024 * 1024), 2),
        'assets': sorted(assets, key=lambda x: x['size'], reverse=True)
    }

def get_file_type(filename):
    """Determine file type"""
    if filename.endswith('.js'):
        return 'javascript'
    elif filename.endswith('.css'):
        return 'stylesheet'
    elif filename.endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
        return 'image'
    else:
        return 'other'

def analyze_bundle(dist_dir='frontend/dist'):
    """Analyze bundle and show report"""
    data = parse_build_output(dist_dir)
    
    if not data:
        return
    
    print("\n" + "="*60)
    print("📦 BUNDLE SIZE ANALYSIS")
    print("="*60)
    print(f"\nTotal Bundle Size: {data['total_size_mb']} MB")
    print(f"Timestamp: {data['timestamp']}")
    
    # Group by type
    by_type = {}
    for asset in data['assets']:
        asset_type = asset['type']
        if asset_type not in by_type:
            by_type[asset_type] = {'count': 0, 'size': 0}
        by_type[asset_type]['count'] += 1
        by_type[asset_type]['size'] += asset['size']
    
    print("\n📊 By Type:")
    for asset_type, info in sorted(by_type.items(), key=lambda x: x[1]['size'], reverse=True):
        size_mb = round(info['size'] / (1024 * 1024), 2)
        print(f"  {asset_type.capitalize()}: {info['count']} files, {size_mb} MB")
    
    # Top 10 largest files
    print("\n🔝 Top 10 Largest Files:")
    for i, asset in enumerate(data['assets'][:10], 1):
        print(f"  {i}. {asset['name']}: {asset['size_kb']} KB")
    
    # Warnings
    print("\n⚠️  Warnings:")
    warnings = []
    
    for asset in data['assets']:
        if asset['type'] == 'javascript' and asset['size'] > 500 * 1024:
            warnings.append(f"Large JS file: {asset['name']} ({asset['size_kb']} KB)")
        elif asset['type'] == 'stylesheet' and asset['size'] > 100 * 1024:
            warnings.append(f"Large CSS file: {asset['name']} ({asset['size_kb']} KB)")
        elif asset['type'] == 'image' and asset['size'] > 500 * 1024:
            warnings.append(f"Large image: {asset['name']} ({asset['size_kb']} KB)")
    
    if warnings:
        for warning in warnings:
            print(f"  • {warning}")
    else:
        print("  ✓ No issues found!")
    
    # Save history
    save_history(data)
    
    print("\n" + "="*60)

def save_history(data, history_file='scripts/bundle_history.json'):
    """Save bundle size history"""
    history_path = Path(history_file)
    history_path.parent.mkdir(exist_ok=True)
    
    history = []
    if history_path.exists():
        with open(history_path, 'r') as f:
            history = json.load(f)
    
    # Add current data (keep only summary)
    history.append({
        'timestamp': data['timestamp'],
        'total_size_mb': data['total_size_mb'],
        'asset_count': len(data['assets'])
    })
    
    # Keep last 30 entries
    history = history[-30:]
    
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)
    
    print(f"\n💾 History saved to {history_file}")
    
    # Show trend
    if len(history) > 1:
        prev = history[-2]['total_size_mb']
        curr = history[-1]['total_size_mb']
        diff = curr - prev
        
        if diff > 0:
            print(f"📈 Bundle size increased by {abs(diff):.2f} MB")
        elif diff < 0:
            print(f"📉 Bundle size decreased by {abs(diff):.2f} MB")
        else:
            print("➡️  Bundle size unchanged")

if __name__ == "__main__":
    analyze_bundle()
