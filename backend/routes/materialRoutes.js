import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadMaterial } from "../controllers/materialController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadMaterial);

export default router;
