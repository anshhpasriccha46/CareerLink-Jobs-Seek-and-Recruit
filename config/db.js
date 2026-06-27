import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected YAYY!!!!!");
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;