import cloudinary from "../config/cloudinary.js";

const deletefromCloudinary = async (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");

    if (uploadIndex === -1 || uploadIndex + 2 > segments.length) {
      throw new Error("Invalid Cloudinary URL format");
    }

    const publicIdParts = segments.slice(uploadIndex + 2); // skip version segment
    if (!publicIdParts.length) {
      throw new Error("Unable to derive Cloudinary public id");
    }

    const fileName = publicIdParts.pop();
    const basename = fileName.replace(/\.[^.]+$/, "");
    publicIdParts.push(basename);

    const publicId = publicIdParts.join("/");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw error;
  }
};

export default deletefromCloudinary;
