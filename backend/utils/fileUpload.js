const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const AppError = require('./appError');

// Ensure upload directories exist
const ensureUploadDirs = async () => {
  const dirs = [
    'public/uploads/avatars',
    'public/uploads/stories',
    'public/uploads/temp'
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Initialize upload directories
ensureUploadDirs();

// Multer storage configuration
const multerStorage = multer.memoryStorage();

// File filter function
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Image processing utilities
const processImage = async (buffer, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 90,
    format = 'jpeg'
  } = options;

  let processor = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    processor = processor.resize(width, height, {
      fit: 'cover',
      position: 'center'
    });
  }

  // Convert format and compress
  if (format === 'jpeg') {
    processor = processor.jpeg({ quality });
  } else if (format === 'png') {
    processor = processor.png({ quality });
  } else if (format === 'webp') {
    processor = processor.webp({ quality });
  }

  return processor.toBuffer();
};

// Generate unique filename
const generateFileName = (originalName, prefix = '') => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  return `${prefix}${timestamp}-${random}${ext}`;
};

// Save processed image
const saveImage = async (buffer, filename, directory = 'temp') => {
  const filePath = path.join('public/uploads', directory, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${directory}/${filename}`;
};

// Delete file
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join('public', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Middleware for avatar upload
const uploadAvatar = upload.single('avatar');

const processAvatar = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = generateFileName(req.file.originalname, 'avatar-');
    
    // Process image - create multiple sizes
    const sizes = [
      { width: 150, height: 150, suffix: '' },
      { width: 50, height: 50, suffix: '-sm' },
      { width: 32, height: 32, suffix: '-xs' }
    ];

    const processedImages = {};

    for (const size of sizes) {
      const processedBuffer = await processImage(req.file.buffer, {
        width: size.width,
        height: size.height,
        quality: 85,
        format: 'jpeg'
      });

      const sizedFilename = filename.replace('.', `${size.suffix}.`);
      const imagePath = await saveImage(processedBuffer, sizedFilename, 'avatars');
      
      if (size.suffix === '') {
        processedImages.main = imagePath;
      } else {
        processedImages[size.suffix.substring(1)] = imagePath;
      }
    }

    req.processedImages = processedImages;
    next();
  } catch (error) {
    return next(new AppError('Error processing avatar image', 500));
  }
};

// Middleware for story image upload
const uploadStoryImage = upload.single('storyImage');

const processStoryImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = generateFileName(req.file.originalname, 'story-');
    
    // Process image - create multiple sizes
    const sizes = [
      { width: 800, height: 600, suffix: '' },
      { width: 400, height: 300, suffix: '-md' },
      { width: 200, height: 150, suffix: '-sm' }
    ];

    const processedImages = {};

    for (const size of sizes) {
      const processedBuffer = await processImage(req.file.buffer, {
        width: size.width,
        height: size.height,
        quality: 80,
        format: 'jpeg'
      });

      const sizedFilename = filename.replace('.', `${size.suffix}.`);
      const imagePath = await saveImage(processedBuffer, sizedFilename, 'stories');
      
      if (size.suffix === '') {
        processedImages.main = imagePath;
      } else {
        processedImages[size.suffix.substring(1)] = imagePath;
      }
    }

    req.processedImages = processedImages;
    next();
  } catch (error) {
    return next(new AppError('Error processing story image', 500));
  }
};

// Validation middleware
const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image to upload', 400));
  }

  // Check file size
  if (req.file.size > 5 * 1024 * 1024) {
    return next(new AppError('Image size must be less than 5MB', 400));
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Only JPEG, PNG, and WebP images are allowed', 400));
  }

  next();
};

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File too large. Maximum size is 5MB', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Unexpected field name for file upload', 400));
    }
  }
  next(error);
};

module.exports = {
  uploadAvatar,
  processAvatar,
  uploadStoryImage,
  processStoryImage,
  validateImageUpload,
  handleMulterError,
  deleteFile,
  processImage,
  saveImage,
  generateFileName
};
