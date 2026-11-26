import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  listing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  // Stores Listing IDs so the existing My Booking UI can populate listing cards.
  booking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
