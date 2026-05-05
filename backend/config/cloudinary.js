import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config(); 
const uploadOnCloudinary = async (filePath) => {
   cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
   });
   try {
      if (!filePath) return null;

      const uploadResult = await cloudinary.uploader.upload(filePath, {
         resource_type: "auto",
         access_mode: 'public',
         type: 'upload'
      });
      console.log("Cloudinary Upload Result:", uploadResult.secure_url);
      try {
         fs.unlinkSync(filePath);
      } catch (err) {
         console.warn("Could not delete local file immediately (might be locked):", err.message);
      }
      return uploadResult.secure_url;
   } catch (error) {
      try {
         fs.unlinkSync(filePath);
      } catch (err) {
      }
      console.log("Cloudinary Upload Error:", error);
      return null;
   }
};
export default uploadOnCloudinary;
