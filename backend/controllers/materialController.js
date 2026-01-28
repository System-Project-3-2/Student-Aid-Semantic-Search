import Material from "../models/materialModel.js";
import extractPdfText from "../utils/pdfParser.js";
import extractDocText from "../utils/docParser.js";
import extractPptx from "../utils/pptxParser.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import deletefromCloudinary from "../utils/cloudinaryDelete.js";

import MaterialChunk from "../models/materialChunkModel.js";
import { chunkText } from "../utils/chunkText.js";
import { embedText } from "../services/embeddingServices.js";

import path from "path";

// Upload material (Teacher/Admin only)
export const uploadMaterial = async (req, res) => {
  try {
    const { courseTitle, courseNo, type } = req.body;
    const file = req.file;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    let textContent = "";
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
      textContent = await extractPdfText(file.path);
    } else if (ext === ".docx") {
      textContent = await extractDocText(file.path);
    } else if (ext === ".pptx") {
      textContent = await extractPptx(file.path);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const fileUrl = await uploadToCloudinary(file.path);

    const material = {
      courseTitle,
      courseNo,
      type,
      fileUrl,
      textContent,
      uploadedBy: req.user._id,
    };

    const newMaterial = await Material.create(material);
    const chunks = chunkText(textContent, 600); // chunkify the text
    for (const chunk of chunks) {
      const embedding = await embedText(chunk);
      await MaterialChunk.create({
        materialId: newMaterial._id,
        chunkText: chunk,
        embedding,
      });
    }

    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all materials (Admin/Student - all materials, Teacher - own materials only)
export const getAllMaterials = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let materials;

    if (role === "teacher") {
      // Teachers can only see their own materials
      materials = await Material.find({ uploadedBy: _id })
        .populate("uploadedBy", "name email")
        .select("-textContent")
        .sort({ createdAt: -1 });
    } else {
      // Admin and Student can see all materials
      materials = await Material.find()
        .populate("uploadedBy", "name email")
        .select("-textContent")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single material by ID
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    const material = await Material.findById(id)
      .populate("uploadedBy", "name email");

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Teachers can only access their own materials
    if (role === "teacher" && material.uploadedBy._id.toString() !== _id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only view your own materials." });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update material (Admin - any, Teacher - own only)
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseTitle, courseNo, type } = req.body;
    const { role, _id } = req.user;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Teachers can only update their own materials
    if (role === "teacher" && material.uploadedBy.toString() !== _id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only update your own materials." });
    }

    // Update only provided fields
    if (courseTitle) material.courseTitle = courseTitle;
    if (courseNo) material.courseNo = courseNo;
    if (type) material.type = type;

    const updatedMaterial = await material.save();

    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete material (Admin - any, Teacher - own only)
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Teachers can only delete their own materials
    if (role === "teacher" && material.uploadedBy.toString() !== _id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only delete your own materials." });
    }

    await deletefromCloudinary(material.fileUrl);
    await Material.findByIdAndDelete(id);
    await MaterialChunk.deleteMany({ materialId: id });

    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
