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
const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2"; // Free, fast, good quality

const embedWithHuggingFace = async (text) => {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  const response = await fetch(
    `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const embedding = await response.json();
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