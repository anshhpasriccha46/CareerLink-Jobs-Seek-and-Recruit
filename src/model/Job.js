import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
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

        logo: {
            data: Buffer,
            contentType: String
        },

        jobType: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        experience: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recruiter",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;