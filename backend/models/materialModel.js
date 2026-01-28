import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    tcourseTitle: { type: String, required: true },
    type: { type: String, required: true },
    courseNo: { type: String, required: true },
    fileUrl: { type: String, required: true },
    textContent: { type: String },
    // embedding: { type: Array },
  },
  { timestamps: true }
);
const Material = mongoose.model("Material", materialSchema);

export default Material;