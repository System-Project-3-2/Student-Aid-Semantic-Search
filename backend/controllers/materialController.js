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

export const uploadMaterial = async (req, res) => {
  try {
    const { title, course, type } = req.body;
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
      title,
      course,
      type,
      fileUrl,
      textContent,
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

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    await deletefromCloudinary(material.fileUrl);
    await Material.findByIdAndDelete(id);
    await MaterialChunk.deleteMany({ materialId: id });

    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
