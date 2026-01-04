import Feedback from "../models/feedbackModel";


export const createFeedback = async (req, res) => {
    try {
        const {title,message,category} = req.body;

        const studentFeedback={
            student: req.user._id,
            title,
            message,
            category
        };

        const feedback=await Feedback.create(studentFeedback);
        res.status(201).json(feedback);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
};