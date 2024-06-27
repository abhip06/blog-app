import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath: string) => {
    try {

        if (!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "Blog-App",
        });

        // file has been uploaded successfully on Cloudinary
        console.log("File has been uploaded successfully on Cloudinary !!!\n");
        fs.unlinkSync(localFilePath);   // Remove the locally saved temporary file after the file uploaded successfully.
        return response;

    } catch (error) {

        fs.unlinkSync(localFilePath);   // Remove the locally saved temporary file as the upload operation got failed.
        console.log("\nERROR OCCUR WHILE UPLODING THE FILE ON CLOUDINARY: ", error);
        return null;
    }
}