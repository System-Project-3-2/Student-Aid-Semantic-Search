import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

const uploadToCloudinary = async(filePath)=>{
    const result=await cloudinary.uploader.upload(filePath,{ // upload options
        resource_type:"raw",
        folder:"student-aid/materials",
    });
    fs.unlinkSync(filePath); // delete local temp file
    return result.secure_url; // return the URL of the uploaded file
};


export default uploadToCloudinary;