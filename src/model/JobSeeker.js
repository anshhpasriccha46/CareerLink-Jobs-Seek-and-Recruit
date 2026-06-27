import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      default: null,
    },

    experience: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    profilePicture: {
      data: Buffer,
      contentType: String,
    },

    resume: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

export default JobSeeker;