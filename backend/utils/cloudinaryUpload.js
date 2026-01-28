import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

/**
 * Upload file to Cloudinary with proper configuration for document files
 * @param {string} filePath - Local file path to upload
 * @returns {string} - Cloudinary secure URL
 */
const uploadToCloudinary = async (filePath) => {
  try {
    // Get the file extension for proper handling
    const ext = path.extname(filePath).toLowerCase();
    
    // Determine the original filename for public_id
    const filename = path.basename(filePath, ext);
    
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Required for non-image/video files (PDF, DOCX, PPTX)
      folder: "student-aid/materials",
      public_id: `${filename}${ext}`, // Preserve extension in public_id
      use_filename: true,
      unique_filename: true,
      access_mode: "public", // Ensure file is publicly accessible
      type: "upload", // Standard upload type (not private)
    });

    // Log for debugging (remove in production)
    console.log("Cloudinary upload success:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type,
    });

    // Return the secure URL
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  } finally {
    // Clean up local temp file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temp file:", cleanupError.message);
    }
  }
};

export default uploadToCloudinary;