import mongoose from 'mongoose';

const codeSubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    language: { type: String, 
        required: true
     },

     code: { type: String,
        required: true 
     }
}, 
{ 
    timestamps: true 
}
);

export default mongoose.model("CodeSubmission", codeSubmissionSchema);