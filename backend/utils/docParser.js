import fs from "fs";
import mammoth from "mammoth";

const parseDocx = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value; // returns the extracted text
};

export default parseDocx;