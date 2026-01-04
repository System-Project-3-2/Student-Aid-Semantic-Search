import cron from "node-cron";
import Feedback from "../models/feedbackModel.js";

const deleteResolvedFeedbacks = () => {
  cron.schedule("0 * * * *", async () => {
    // runs every hour
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await Feedback.deleteMany({
        status: "resolved",
        resolvedAt: { $lte: oneDayAgo },
      });

      if (result.deletedCount > 0) {
        console.log(` Deleted ${result.deletedCount} resolved feedback(s)`);
      }
    } catch (error) {
      console.error("Feedback cleanup error:", error.message);
    }
  });
};

export default deleteResolvedFeedbacks;
