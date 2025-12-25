import mammoth from 'mammoth';

const parseDocx = async (fileBuffer) => {
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value; // returns the extracted text
}

export default parseDocx;