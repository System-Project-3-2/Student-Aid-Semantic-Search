export const chunkText = (text, chunkSize) => {
  if (chunkSize <= 0) {
    throw new Error("Chunk size must be a positive integer");
  }

  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    const combinedLength = currentChunk.length
      ? currentChunk.length + 1 + sentence.length
      : sentence.length;

    if (combinedLength <= chunkSize) {
      currentChunk += (currentChunk ? " " : "") + sentence;
      continue;
    }

    if (currentChunk) {
      chunks.push(currentChunk);
      currentChunk = "";
    }

    if (sentence.length > chunkSize) {
      for (let i = 0; i < sentence.length; i += chunkSize) {
        chunks.push(sentence.slice(i, i + chunkSize));
      }
    } else {
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};
