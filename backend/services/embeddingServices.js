// Choose embedding provider: 'openai' or 'huggingface'
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || "huggingface";

// ============= OpenAI Embedding =============
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embedWithOpenAI = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });
  return response.data[0].embedding;
};

// ============= Hugging Face Embedding (FREE) =============
// Using BAAI/bge-small-en-v1.5 - optimized for embeddings via TEI
const HF_MODEL = "BAAI/bge-small-en-v1.5";

const embedWithHuggingFace = async (text) => {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  // Use the Text Embeddings Inference (TEI) endpoint
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: text,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const embedding = await response.json();
  
  // Handle nested array response - flatten if needed
  if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
    return embedding[0];
  }
  
  return embedding;
};

// ============= Main Export =============
export const embedText = async (text) => {
  if (EMBEDDING_PROVIDER === "openai") {
    return embedWithOpenAI(text);
  } else {
    return embedWithHuggingFace(text);
  }
};