import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobSeeker",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        experience: {
            type: String,
            default: ""
        },

        profilePicture: {
            data: Buffer,
            contentType: String
        }
    },
    {
        timestamps: true
    }
);

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;