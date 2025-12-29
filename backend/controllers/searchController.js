import MaterialChunk from "../models/materialChunkModel";
import { embedText } from "../services/embeddingService.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    const queryEmbedding = await embedText(query);
    const allChunks = await MaterialChunk.find().populate("materialId"); // Populate to get material details


    const scoredResults = allChunks.map((chunk) => ({
      material: chunk.materialId._id,
      text: chunk.chunkText,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scoredResults.sort((a, b) => b.score - a.score); //descending order

    const topResults = scoredResults.slice(0, 10);

    res.json(topResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
