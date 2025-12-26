import Material from "../models/materialModel.js";
import extractPdfText from "../utils/pdfParser.js";
import extractDocText from "../utils/docParser.js";
import extractPptx from "../utils/pptxParser.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

import MaterialChunk from "../models/materialChunkModel.js";
import { chunkText } from "../utils/chunkText.js";
import { embedText } from "../services/embeddingService.js";

import path from "path";

export const uploadMaterial = async (req, res) => {
  try {
    const { title, course, type } = req.body;
    const file = req.file;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    let extractedText = "";
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
      extractedText = await extractPdfText(file.path);
    } else if (ext === ".docx") {
      extractedText = await extractDocText(file.path);
    } else if (ext === ".pptx") {
      extractedText = await extractPptx(file.path);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const fileUrl = await uploadToCloudinary(file.path);

    const material={
      title,
      course,
      type,
      fileUrl,
      extractedText,
    };

    const newMaterial = await Material.create(material);
    const chunks = chunkText(extractedText, 600); //chunkify the text
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
