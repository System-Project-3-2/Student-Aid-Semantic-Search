import fs from "fs";
import * as pdf from "pdf-parse";

const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf.default(dataBuffer);
  return data.text;
};

export default extractPdfText;