import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function test() {
    const fileUrl = "https://res.cloudinary.com/dcpkv1zc3/image/upload/v1714400000/gtn3uqar4jcd9spcxoz2.pdf";
    console.log("Original URL:", fileUrl);
    const fetchUrl = (url) => new Promise((resolve, reject) => {
        https.get(url, (res) => {
            resolve(res.statusCode);
        }).on('error', reject);
    });

    try {
        const status = await fetchUrl(fileUrl);
        console.log("Original URL fetched successfully, status:", status);
    } catch (e) {
        console.log("Original URL failed:", e);
    }

    const publicId = "gtn3uqar4jcd9spcxoz2";
    const signedUrl = cloudinary.url(publicId, {
        resource_type: "image",
        sign_url: true,
        secure: true,
        flags: 'attachment',
        type: 'upload'
    });
    console.log("Signed URL with format:", signedUrl);
    try {
        const status = await fetchUrl(signedUrl);
        console.log("Signed URL fetched successfully, status:", status);
    } catch (e) {
        console.log("Signed URL failed:", e);
    }
}
test();
