import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer (file stays in RAM, not saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @returns {Promise<object>}
 */
const imageUploadUtil = async(file) => {
   const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
   
  });

  return result;
};

export { upload, imageUploadUtil, cloudinary };
