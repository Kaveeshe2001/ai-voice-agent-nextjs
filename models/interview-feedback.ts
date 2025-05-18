import mongoose, { models, Schema } from "mongoose";

const interviewFeedbackSchema = new Schema(
  {
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    feedback: {
      type: Schema.Types.Mixed,
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    recommended: {
        type: Boolean
    }
  },
  { timestamps: true }
);

const InterviewFeedback =
  models.InterviewFeedback ||
  mongoose.model("InterviewFeedback", interviewFeedbackSchema);

export default InterviewFeedback;
