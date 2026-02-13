// Upload Service
// Business logic for file uploads and processing

import imageProcessor from '../utils/imageProcessor.js'
import fileValidator from '../utils/fileValidator.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class UploadService {
  async processUpload(file) {
    try {
      console.log('🚀 Starting upload process...')
      
      // Validate file (now accepts everything)
      const validation = fileValidator.validate(file)
      if (!validation.isValid) {
        console.log('❌ Validation failed:', validation.error)
        return {
          success: false,
          status: 400,
          error: validation.error
        }
      }

      const { name: originalName, size: originalSize, mimetype } = file
      const ext = originalName.toLowerCase().split('.').pop()

      console.log(`📁 Processing file: ${originalName} (${originalSize} bytes, ${mimetype})`)
      console.log(`🔍 Extension: ${ext}`)
      console.log(`🎬 Is video: ${fileValidator.isVideo(ext, mimetype)}`)
      console.log(`🖼️ Is image: ${fileValidator.isImage(ext, mimetype)}`)

      // Handle video files (or any file that looks like video)
      if (fileValidator.isVideo(ext, mimetype)) {
        console.log('➡️ Processing as video')
        return await this.processVideo(file)
      }

      // Handle image files (or any file that looks like image)
      if (fileValidator.isImage(ext, mimetype)) {
        console.log('➡️ Processing as image')
        return await this.processImage(file)
      }

      // Handle any other file type as generic file
      console.log('➡️ Processing as generic file')
      return await this.processGenericFile(file)
    } catch (error) {
      console.error('💥 Upload service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Upload processing failed: ' + error.message
      }
    }
  }

  async processVideo(file) {
    try {
      // Generate unique filename
      const extension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${extension}`;
      
      // Define upload directory
      const uploadDir = path.join(__dirname, '../../../public/uploads/videos');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Move uploaded file to public directory
      const destinationPath = path.join(uploadDir, uniqueFilename);
      if (!file.path) {
        throw new Error('Uploaded file path is undefined');
      }
      fs.copyFileSync(file.path, destinationPath);
      
      // Return public URL
      const result = {
        url: `/uploads/videos/${uniqueFilename}`,
        publicId: uniqueFilename,
        filename: uniqueFilename,
        format: extension.substring(1),
        originalSize: file.size
      };
      
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'video',
          originalSize: file.size,
          filename: result.filename,
          format: result.format
        }
      }
    } catch (error) {
      console.error('Video processing error:', error)
      return {
        success: false,
        status: 500,
        error: 'Video processing failed: ' + error.message
      }
    }
  }

  async processImage(file) {
    try {
      console.log('🖼️ Processing image locally:', file.name)
      
      // Generate unique filename
      const extension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${extension}`;
      
      // Define upload directory
      const uploadDir = path.join(__dirname, '../../../public/uploads/images');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Move uploaded file to public directory
      const destinationPath = path.join(uploadDir, uniqueFilename);
      if (!file.path) {
        throw new Error('Uploaded file path is undefined');
      }
      fs.copyFileSync(file.path, destinationPath);
      
      // Get image dimensions if possible
      let width = null, height = null;
      try {
        if (file.path) {  // Make sure file.path exists before using it
          const sharp = await import('sharp');
          const metadata = await sharp.default(file.path).metadata();
          width = metadata.width;
          height = metadata.height;
        } else {
          console.log('File path not available for dimension extraction');
        }
      } catch (err) {
        console.log('Could not get image dimensions:', err.message);
      }
      
      const result = {
        url: `/uploads/images/${uniqueFilename}`,
        publicId: uniqueFilename,
        filename: uniqueFilename,
        format: extension.substring(1),
        originalSize: file.size,
        width,
        height
      };
      
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'image',
          originalSize: file.size,
          filename: result.filename,
          format: result.format,
          width: result.width,
          height: result.height
        }
      }
    } catch (error) {
      console.error('💥 Image upload error:', error)
      return {
        success: false,
        status: 500,
        error: 'Image upload failed: ' + error.message
      }
    }
  }

  async processGenericFile(file) {
    try {
      console.log(`📄 Processing generic file: ${file.name}`)
      
      // Generate unique filename
      const extension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${extension}`;
      
      // Define upload directory
      const uploadDir = path.join(__dirname, '../../../public/uploads/files');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Move uploaded file to public directory
      const destinationPath = path.join(uploadDir, uniqueFilename);
      if (!file.path) {
        throw new Error('Uploaded file path is undefined');
      }
      fs.copyFileSync(file.path, destinationPath);
      
      const result = {
        url: `/uploads/files/${uniqueFilename}`,
        publicId: uniqueFilename,
        filename: uniqueFilename,
        mimetype: file.mimetype,
        originalSize: file.size
      };
      
      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          type: 'file',
          originalSize: file.size,
          filename: result.filename,
          mimetype: result.mimetype
        }
      }
    } catch (error) {
      console.error('Generic file processing error:', error)
      return {
        success: false,
        status: 500,
        error: 'File processing failed: ' + error.message
      }
    }
  }

  async deleteFile(filePath) {
    try {
      // Construct the full file path
      const fullPath = path.join(__dirname, '../../..', filePath);
      
      // Check if file exists
      if (fs.existsSync(fullPath)) {
        // Delete the file
        fs.unlinkSync(fullPath);
        
        return {
          success: true,
          data: { message: 'File deleted successfully', filePath }
        }
      } else {
        return {
          success: false,
          status: 404,
          error: 'File not found'
        }
      }
    } catch (error) {
      console.error('Delete file service error:', error)
      return {
        success: false,
        status: 500,
        error: 'File deletion failed: ' + error.message
      }
    }
  }

  async cleanupOrphanFiles() {
    try {
      // Read current mockData.json to get all used URLs
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      let mockData = {}
      try {
        const fileContent = fs.readFileSync(mockDataPath, 'utf-8')
        mockData = JSON.parse(fileContent)
      } catch (err) {
        console.warn('Could not read mockData.json:', err.message)
        return {
          success: false,
          status: 500,
          error: 'Could not read mockData.json: ' + err.message
        }
      }
      
      // Get all used URLs from mockData
      const usedUrls = [];
      
      // Extract URLs from various parts of mockData
      if (Array.isArray(mockData.programs)) {
        mockData.programs.forEach(program => {
          if (program.imageUrl) usedUrls.push(program.imageUrl);
          if (program.videoUrl) usedUrls.push(program.videoUrl);
        });
      }
      
      if (Array.isArray(mockData.instructors)) {
        mockData.instructors.forEach(instructor => {
          if (instructor.imageUrl) usedUrls.push(instructor.imageUrl);
        });
      }
      
      if (Array.isArray(mockData.videos)) {
        mockData.videos.forEach(video => {
          if (video.videoUrl) usedUrls.push(video.videoUrl);
          if (video.thumbnailUrl) usedUrls.push(video.thumbnailUrl);
        });
      }
      
      if (mockData.home?.hero?.imageUrl) usedUrls.push(mockData.home.hero.imageUrl);
      if (mockData.about?.hero?.imageUrl) usedUrls.push(mockData.about.hero.imageUrl);
      if (mockData.contactPage?.hero?.imageUrl) usedUrls.push(mockData.contactPage.hero.imageUrl);
      
      // Get all files in upload directories
      const uploadDirs = [
        path.join(__dirname, '../../../public/uploads/images'),
        path.join(__dirname, '../../../public/uploads/videos'),
        path.join(__dirname, '../../../public/uploads/files')
      ];
      
      const deletedFiles = [];
      
      for (const dir of uploadDirs) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          
          for (const file of files) {
            const fileUrl = `/uploads/${path.basename(dir)}/${file}`;
            
            if (!usedUrls.includes(fileUrl)) {
              const filePath = path.join(dir, file);
              fs.unlinkSync(filePath);
              deletedFiles.push(fileUrl);
            }
          }
        }
      }
      
      return {
        success: true,
        data: {
          deletedCount: deletedFiles.length,
          deletedFiles
        }
      }
    } catch (error) {
      console.error('Cleanup service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Cleanup failed: ' + error.message
      }
    }
  }
}

export const uploadService = new UploadService()
export default uploadService