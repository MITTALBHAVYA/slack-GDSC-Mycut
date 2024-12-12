// services/cloudinaryService.js
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {Buffer} fileBuffer - The buffer of the file to upload
 * @returns {Promise<Object>} - Resolves with the upload result
 */
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: `chat-app-files/`,
      resource_type: 'auto', // Supports images, videos, and other file types
    };

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    // Pipe the file buffer to the upload stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Determine the type of a file based on its mimetype
 * @param {string} mimetype - The MIME type of the file
 * @returns {string} - The determined file type
 */
export const determineFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.includes('document') || mimetype.includes('word')) return 'document';
  return 'file';
};
