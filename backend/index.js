import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 6000;
app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = (process.env.CLIENT_URL || "https://airbnbin.onrender.com,http://localhost:5173")
      .split(",").map((item) => item.trim()).filter(Boolean);
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.get("/", (_req, res) => res.status(200).json({ message: "Airbnbin API is running" }));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  console.error("API error:", error);
  res.status(error.status || 500).json({ message: error.message || "Internal server error" });
});

const start = async () => {
  await connectDb();
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};
start();
