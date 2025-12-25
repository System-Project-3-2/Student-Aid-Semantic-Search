import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  fileType=[".pdf", ".docx", ".pptx"]
  if (fileType.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, PPTX allowed"));
  }
};
const upload = multer({ storage, fileFilter });

export default upload;