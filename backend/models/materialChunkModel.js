import mongoose from "mongoose";

const materialChunkSchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      
      required: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

const MaterialChunk = mongoose.model("MaterialChunk", materialChunkSchema);

export default MaterialChunk;