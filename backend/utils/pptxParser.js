import pptxParser from "pptx-parser";

/**
 * Parse PPTX file buffer and extract text
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>}
 */
const parsePptx = async (fileBuffer) => {
  const slides = await pptxParser(fileBuffer);

  let extractedText = "";

  slides.forEach((slide, slideIndex) => {
    slide.texts.forEach(text => {
      extractedText += text + " ";
    });
  });

  return extractedText.trim();
};

export default parsePptx;
