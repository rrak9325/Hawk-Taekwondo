#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Image Optimization Script
Compresses and resizes images for web deployment
Run before deploying to reduce load times
"""

import os
import sys
from pathlib import Path
from PIL import Image
import pillow_heif

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Register HEIF opener
pillow_heif.register_heif_opener()

# Configuration
MAX_WIDTH = 1920
MAX_HEIGHT = 1080
QUALITY = 85
THUMBNAIL_SIZE = (400, 400)

def optimize_image(input_path, output_path, max_width=MAX_WIDTH, quality=QUALITY):
    """Optimize a single image"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if too large
            if img.width > max_width or img.height > MAX_HEIGHT:
                img.thumbnail((max_width, MAX_HEIGHT), Image.LANCZOS)
            
            # Save optimized
            img.save(output_path, 'JPEG', optimize=True, quality=quality)
            
            # Calculate savings
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            savings = ((original_size - new_size) / original_size) * 100
            
            print(f"✓ {input_path.name}")
            print(f"  {original_size // 1024}KB → {new_size // 1024}KB ({savings:.1f}% smaller)")
            
            return True
    except Exception as e:
        print(f"✗ {input_path.name}: {e}")
        return False

def create_thumbnail(input_path, output_path, size=THUMBNAIL_SIZE):
    """Create thumbnail version"""
    try:
        with Image.open(input_path) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            img.thumbnail(size, Image.LANCZOS)
            img.save(output_path, 'JPEG', optimize=True, quality=80)
            print(f"  → Thumbnail: {os.path.getsize(output_path) // 1024}KB")
            return True
    except Exception as e:
        print(f"  ✗ Thumbnail failed: {e}")
        return False

def optimize_directory(input_dir, output_dir, create_thumbs=False):
    """Optimize all images in directory"""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    if not input_path.exists():
        print(f"Error: {input_dir} does not exist")
        return
    
    output_path.mkdir(parents=True, exist_ok=True)
    
    if create_thumbs:
        thumb_path = output_path / 'thumbnails'
        thumb_path.mkdir(exist_ok=True)
    
    # Supported formats
    extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}
    
    images = [f for f in input_path.iterdir() 
              if f.suffix.lower() in extensions and f.is_file()]
    
    if not images:
        print(f"No images found in {input_dir}")
        return
    
    print(f"\nOptimizing {len(images)} images...\n")
    
    success_count = 0
    for img_file in images:
        output_file = output_path / f"{img_file.stem}.jpg"
        
        if optimize_image(img_file, output_file):
            success_count += 1
            
            if create_thumbs:
                thumb_file = thumb_path / f"{img_file.stem}_thumb.jpg"
                create_thumbnail(img_file, thumb_file)
    
    print(f"\n✓ Optimized {success_count}/{len(images)} images")
    print(f"Output: {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python optimize_images.py <input_dir> [output_dir] [--thumbnails]")
        print("\nExample:")
        print("  python optimize_images.py ./raw_images ./frontend/public/images")
        print("  python optimize_images.py ./raw_images ./frontend/public/images --thumbnails")
        sys.exit(1)
    
    input_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else f"{input_dir}_optimized"
    create_thumbs = "--thumbnails" in sys.argv
    
    optimize_directory(input_dir, output_dir, create_thumbs)
