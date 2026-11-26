import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";

const uploadOnCloudnary = async (filepath) => {
  cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDNARY_CLOUD_NAME),
    api_key: (process.env.CLOUDINARY_API_KEY || process.env.CLOUDNARY_API_KEY),
    api_secret: (process.env.CLOUDINARY_API_SECRET || process.env.CLOUDNARY_API_SECRET),
  });
  if (!filepath) throw new Error("An image file is required");
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
      folder: "airbnbin/listings",
    });
    return result.secure_url;
  } finally {
    await fs.unlink(filepath).catch(() => {});
  }
};
export default uploadOnCloudnary;
