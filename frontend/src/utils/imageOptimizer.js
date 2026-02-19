// Image URL optimizer for better loading
export const optimizeImageUrl = (url, options = {}) => {
  if (!url || url.trim() === '') return ''
  
  const {
    width = 800,
    height = 600,
    quality = 'auto:good',
    format = 'auto'
  } = options

  // If it's already a Cloudinary URL, add optimizations
  if (url.includes('cloudinary.com')) {
    // Check if it already has transformations
    if (url.includes('/upload/') && !url.includes('f_auto')) {
      return url.replace('/upload/', `/upload/f_${format},q_${quality},w_${width},h_${height},c_limit/`)
    }
    return url
  }
  
  // For local URLs, return as-is
  return url
}

// Preload critical images
export const preloadImage = (url) => {
  if (!url) return Promise.reject('No URL provided')
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = optimizeImageUrl(url)
  })
}

// Test image URL validity
export const testImageUrl = async (url) => {
  try {
    await preloadImage(url)
    return { valid: true, url }
  } catch (error) {
    console.warn('Image URL test failed:', url, error)
    return { valid: false, url, error }
  }
}