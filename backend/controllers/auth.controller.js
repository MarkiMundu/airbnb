import genToken from "../config/token.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email, listing: user.listing, booking: user.booking });

export const sighUp = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 6) return res.status(400).json({ message: "Name, valid email and password (at least 6 characters) are required" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.cookie("token", genToken(user._id), cookieOptions);
    return res.status(201).json(publicUser(user));
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to create account" });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email }).populate("listing").populate("booking");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });

    //temporary logging for debugging
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Cookie Options:", cookieOptions);

    res.cookie("token", genToken(user._id), cookieOptions);
    //temporary logging for debugging
    console.log("Login Cookie Sent");
    console.log("Token Created:", !!genToken(user._id));
  //temporary logging for debugging
    console.log("Headers Sent:", res.getHeaders());

    return res.status(200).json(publicUser(user));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
};

export const logOut = async (_req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  return res.status(200).json({ message: "Logged out successfully" });
};
