import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "student-aid/materials",
        });
        return result.secure_url; // return the URL of the uploaded file
    } finally {
        try {
            fs.unlinkSync(filePath); // ensure local temp file is removed
        } catch (error) {
            // ignore cleanup errors
        }
    }
};

export default uploadToCloudinary;