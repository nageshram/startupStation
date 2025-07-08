import { uploadImage, getImage } from '../controllers/uploadController.js';
import multer from 'multer';
import express from 'express';
import path from 'path';
const router = express.Router();

const baseUploadDir = path.join('backend', 'uploads');

// Dynamic storage based on field
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'profile_pics';
    if (req.body.type === 'startup') folder = 'startup_pics';
    const uploadDir = path.join(baseUploadDir, folder);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);
  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.get('/:folder/:id', getImage);

// POST /api/upload?type=profile or type=startup
router.post('/', upload.single('image'), uploadImage);

export default router;
