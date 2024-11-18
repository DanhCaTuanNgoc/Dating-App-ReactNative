const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinary');

const uploadImage = async (userId, base64Image) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: `users/${userId}/photos`,  
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" }
      ]
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = {
  uploadImage
};
