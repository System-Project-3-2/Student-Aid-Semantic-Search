import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadMaterial } from "../controllers/materialController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadMaterial);
export default router;
