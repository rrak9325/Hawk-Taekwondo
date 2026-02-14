// Upload Service
// Business logic for file uploads and processing

import imageProcessor from '../utils/imageProcessor.js'
import fileValidator from '../utils/fileValidator.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import cloudinary from '../config/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class UploadService {
  async processUpload(file) {
    try {
      // Validate file
      const validation = fileValidator.validate(file)
      if (!validation.isValid) {
        return {
          success: false,
          status: 400,
          error: validation.error
        }
      }

      const { name: originalName, mimetype } = file
      const ext = originalName.toLowerCase().split('.').pop()

      // Handle video files
      if (fileValidator.isVideo(ext, mimetype)) {
        return await this.processVideo(file)
      }

      // Handle image files
      if (fileValidator.isImage(ext, mimetype)) {
        return await this.processImage(file)
      }

      // Handle any other file type as generic file
      return await this.processGenericFile(file)
    } catch (error) {
      console.error('Upload service error:', error)
      return {
        success: false,
        status: 500,
        error: 'Upload processing failed: ' + error.message
      }
    }
  }

  async processVideo(file) {
    try {
      const filePath = file.path || file.tempFilePath;
      if (!filePath) {
        throw new Error('Uploaded file path is undefined');
      }
      
      // Try Cloudinary upload first
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'hawk-taekwondo/videos',
          public_id: uuidv4(),
          resource_type: 'video',
          chunk_size: 6000000, // 6MB chunks
        });
        
        // Cleanup local temp file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        return {
          success: true,
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            type: 'video',
            originalSize: file.size,
            filename: result.original_filename,
            format: result.format
          }
        };
      } catch (cloudinaryError) {
        console.warn('Cloudinary video upload failed, using local storage:', cloudinaryError.message)
        
        // Fallback to local storage
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
        fs.copyFileSync(filePath, destinationPath);
      
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
        };
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
      const filePath = file.path || file.tempFilePath;
      if (!filePath) {
        throw new Error('Uploaded file path is undefined');
      }
      
      // Try Cloudinary upload first
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'hawk-taekwondo/images',
          public_id: uuidv4(),
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' }
          ]
        });
        
        // Get image dimensions
        let width = null, height = null;
        try {
          const sharp = await import('sharp');
          const metadata = await sharp.default(filePath).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (err) {
          // Silently fail dimension detection
        }
        
        // Cleanup local temp file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        return {
          success: true,
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            type: 'image',
            originalSize: file.size,
            filename: result.original_filename,
            format: result.format,
            width: width,
            height: height
          }
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, using local storage:', cloudinaryError.message)
        
        // Fallback to local storage
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
        fs.copyFileSync(filePath, destinationPath);
      
        // Get image dimensions if possible
        let width = null, height = null;
        try {
          const sharp = await import('sharp');
          const metadata = await sharp.default(filePath).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (err) {
          // Silently fail dimension detection
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
        };
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
      const filePath = file.path || file.tempFilePath;
      if (!filePath) {
        throw new Error('Uploaded file path is undefined');
      }
      fs.copyFileSync(filePath, destinationPath);
      
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