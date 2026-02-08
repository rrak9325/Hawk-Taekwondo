// Upload Service
// Handles file uploads and media management

import apiClient from '../api/client.js'

export class UploadService {
  async uploadFile(file, onProgress = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

      // Use upload method which doesn't set Content-Type header
      const response = await apiClient.upload('/api/upload', formData)
      
      console.log(`✅ Upload complete: ${file.name}`)
      return { 
        success: true, 
        data: response 
      }
    } catch (error) {
      console.error('💥 File upload failed:', error)
      return { 
        success: false, 
        error: error.message || 'Upload failed' 
      }
    }
  }

  async deleteFile(filePath) {
    try {
      const response = await apiClient.request('/api/file', {
        method: 'DELETE',
        body: JSON.stringify({ filePath })
      })
      
      return { success: true, data: response }
    } catch (error) {
      console.error('File deletion failed:', error)
      return { 
        success: false, 
        error: error.message || 'Delete failed' 
      }
    }
  }

  async cleanupOrphanFiles() {
    try {
      const response = await apiClient.post('/api/cleanup')
      return { success: true, data: response }
    } catch (error) {
      console.error('Cleanup failed:', error)
      return { 
        success: false, 
        error: error.message || 'Cleanup failed' 
      }
    }
  }
}

export const uploadService = new UploadService()
export default uploadService