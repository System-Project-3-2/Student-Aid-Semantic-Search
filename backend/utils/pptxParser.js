import officeParser from "officeparser";

/**
 * Parse PPTX buffer and extract text
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>}
 */
const parsePptx = async (fileBuffer) => {
  const text = await officeParser.parseOfficeAsync(fileBuffer);
  return text;
};

export default parsePptx;
