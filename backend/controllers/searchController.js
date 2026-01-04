import MaterialChunk from "../models/materialChunkModel.js";
import { embedText } from "../services/embeddingServices.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

export const semanticSearch = async (req, res) => {
  try {
    const { query, course, type } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const queryEmbedding = await embedText(query);

    // Build material filter
    const materialFilter = {};
    if (course) materialFilter.course = course;
    if (type) materialFilter.type = type;

    // Fetch chunks with filtered materials
    const chunks = await MaterialChunk.find().populate({
      path: "materialId",
      match: materialFilter, //acts as where clause
    });

    // Remove unmatched materials
    const validChunks = chunks.filter((c) => c.materialId);

    const scored = validChunks.map((chunk) => ({
      materialId: chunk.materialId._id.toString(), //material ID as string
      title: chunk.materialId.title,
      course: chunk.materialId.course,
      type: chunk.materialId.type,
      fileUrl: chunk.materialId.fileUrl,
      text: chunk.chunkText,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Group by material
    const grouped = {};
    for (const item of scored.slice(0, 30)) {
      if (!grouped[item.materialId]) {
        grouped[item.materialId] = {
          title: item.title,
          course: item.course,
          type: item.type,
          fileUrl: item.fileUrl,
          matches: [],
        };
      }
      grouped[item.materialId].matches.push(item.text);
    }

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
