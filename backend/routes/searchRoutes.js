import express from "express";
import { semanticSearch } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, semanticSearch);
export default router;
