import mongoose, { models, Schema } from "mongoose";

const interviewSchema = new Schema(
    {
        jobPosition: {
          type: String,
        },
        jobDescription: {
          type: String,
        },
        duration: {
          type: String,
        },
        type: {
          type: String,
        },
        questionsList: {
          type: Schema.Types.Mixed
        },
        userEmail: {
          type: String,
        }
    },
    { timestamps: true }
); 

const Interview = models.Interview || mongoose.model('Interview', interviewSchema);
export default Interview;