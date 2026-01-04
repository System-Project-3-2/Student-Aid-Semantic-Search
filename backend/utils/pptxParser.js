import fs from "fs";
import officeParser from "officeparser";

/**
 * Parse PPTX file and extract text
 * @param {string} filePath
 * @returns {Promise<string>}
 */
const parsePptx = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const text = await officeParser.parseOfficeAsync(fileBuffer);
  return text;
};

export default parsePptx;
