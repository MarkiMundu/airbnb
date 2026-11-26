import uploadOnCloudnary from "../config/cloudnary.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

const uploadImages = async (files, existing = {}) => {
  const urls = {};
  for (const key of ["image1", "image2", "image3"]) {
    const file = files?.[key]?.[0];
    urls[key] = file ? await uploadOnCloudnary(file.path) : existing[key];
  }
  return urls;
};

export const addListing = async (req, res) => {
  try {
    const { title, description, rent, city, landMark, category } = req.body;
    if (![title, description, rent, city, landMark, category].every((v) => String(v ?? "").trim())) return res.status(400).json({ message: "All listing fields are required" });
    if (!Number.isFinite(Number(rent)) || Number(rent) <= 0) return res.status(400).json({ message: "Rent must be a positive number" });
    for (const key of ["image1", "image2", "image3"]) if (!req.files?.[key]?.[0]) return res.status(400).json({ message: `Please upload ${key}` });
    const images = await uploadImages(req.files);
    const listing = await Listing.create({ title: title.trim(), description: description.trim(), rent: Number(rent), city: city.trim(), landMark: landMark.trim(), category, ...images, host: req.userId });
    await User.findByIdAndUpdate(req.userId, { $addToSet: { listing: listing._id } });
    return res.status(201).json(listing);
  } catch (error) {
    console.error("Add listing error:", error);
    return res.status(500).json({ message: error.message || "Unable to add listing" });
  }
};

export const getListing = async (_req, res) => {
  try { return res.status(200).json(await Listing.find().sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ message: "Unable to fetch listings" }); }
};

export const findListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.status(200).json(listing);
  } catch { return res.status(400).json({ message: "Invalid listing ID" }); }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (String(listing.host) !== String(req.userId)) return res.status(403).json({ message: "You can only edit your own listing" });
    const { title, description, rent, city, landMark, category } = req.body;
    const updates = {};
    for (const [key, value] of Object.entries({ title, description, city, landMark, category })) if (value !== undefined) updates[key] = String(value).trim();
    if (rent !== undefined) {
      if (!Number.isFinite(Number(rent)) || Number(rent) <= 0) return res.status(400).json({ message: "Rent must be a positive number" });
      updates.rent = Number(rent);
    }
    Object.assign(updates, await uploadImages(req.files, listing));
    const updated = await Listing.findByIdAndUpdate(listing._id, { $set: updates }, { new: true, runValidators: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Update listing error:", error);
    return res.status(500).json({ message: error.message || "Unable to update listing" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (String(listing.host) !== String(req.userId)) return res.status(403).json({ message: "You can only delete your own listing" });
    if (listing.isBooked) return res.status(409).json({ message: "Cancel the active booking before deleting this listing" });
    await Listing.findByIdAndDelete(listing._id);
    await User.findByIdAndUpdate(req.userId, { $pull: { listing: listing._id } });
    return res.status(200).json({ message: "Listing deleted" });
  } catch (error) { return res.status(500).json({ message: error.message || "Unable to delete listing" }); }
};

export const ratingListing = async (req, res) => {
  try {
    const ratings = Number(req.body.ratings);
    if (!Number.isFinite(ratings) || ratings < 0 || ratings > 5) return res.status(400).json({ message: "Rating must be between 0 and 5" });
    const listing = await Listing.findByIdAndUpdate(req.params.id, { ratings }, { new: true, runValidators: true });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    return res.status(200).json({ ratings: listing.ratings });
  } catch { return res.status(400).json({ message: "Unable to save rating" }); }
};

export const search = async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) return res.status(200).json([]);
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const results = await Listing.find({ $or: ["landMark", "city", "title", "category"].map((field) => ({ [field]: { $regex: escaped, $options: "i" } })) }).sort({ createdAt: -1 });
    return res.status(200).json(results);
  } catch { return res.status(500).json({ message: "Search failed" }); }
};
