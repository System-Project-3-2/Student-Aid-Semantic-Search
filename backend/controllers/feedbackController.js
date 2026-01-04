import Feedback from "../models/feedbackModel.js";

export const createFeedback = async (req, res) => {
  try {
    const { title, message, category } = req.body;

    const studentFeedback = {
      student: req.user._id,
      title,
      message,
      category,
    };

    const feedback = await Feedback.create(studentFeedback);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT: View own feedbacks
export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//view all feedbacks - ADMIN/Teacher
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const respondToFeedback = async (req, res) => {
  try {
    const { response } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.response = response;
    feedback.status = "resolved";
    feedback.resolvedAt = new Date();
    feedback.respondedBy = req.user._id;

    await feedback.save();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
