import mongoose from "mongoose";

const codeSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ["c", "cpp", "java", "python", "javascript"],
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CodeSubmission", codeSubmissionSchema);
