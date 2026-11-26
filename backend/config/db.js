import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL is missing");
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("MongoDB connected");
};
export default connectDb;
