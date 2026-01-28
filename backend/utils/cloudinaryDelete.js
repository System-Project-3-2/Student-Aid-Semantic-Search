import cloudinary from "../config/cloudinary.js";

/**
 * Delete file from Cloudinary
 * @param {string} fileUrl - Cloudinary secure URL of the file to delete
 */
const deletefromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new Error("No file URL provided");
    }

    const url = new URL(fileUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    
    // Find the upload index in the path
    const uploadIndex = segments.indexOf("upload");

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL format - 'upload' not found");
    }

    // Get parts after 'upload' and version (e.g., v1234567890)
    // Path structure: /upload/v1234567890/folder/subfolder/filename.ext
    let publicIdParts = segments.slice(uploadIndex + 1);
    
    // Skip version segment if present (starts with 'v' followed by numbers)
    if (publicIdParts.length > 0 && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts = publicIdParts.slice(1);
    }

    if (!publicIdParts.length) {
      throw new Error("Unable to derive Cloudinary public id");
    }

    // For raw resource types, keep the full public_id including extension
    const publicId = publicIdParts.join("/");

    console.log("Deleting from Cloudinary:", { publicId, resource_type: "raw" });

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true, // Invalidate cached copies
    });

    console.log("Cloudinary delete result:", result);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw error;
  }
};

export default deletefromCloudinary;
