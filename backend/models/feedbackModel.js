import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Missing Material", "Wrong Content", "Technical Issue", "Other"],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    response: {
      type: String,
    },

    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
