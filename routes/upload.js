const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to stream upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'registration_photos',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private (optional protection: let's make it private for registered users)
router.post('/', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo' });
    }

    // Check if Cloudinary credentials are set up
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloudinary')
    ) {
      // Fallback for development if credentials are not configured yet
      console.warn('Cloudinary not configured. Returning dummy local/placeholder URL.');
      const base64Image = req.file.buffer.toString('base64');
      const dummyUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      return res.json({ 
        url: dummyUrl,
        message: 'Dev Mode: Cloudinary not configured, returned image as Base64 URI.' 
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
});

module.exports = router;
