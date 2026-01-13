import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const extractPdfText = async (filePath) => {
  const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await getDocument({ data: dataBuffer }).promise;
  
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText;
};

export default extractPdfText;