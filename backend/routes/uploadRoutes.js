import { uploadImage, getImage } from '../controllers/uploadController.js';
import multer from 'multer';
import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();

const baseUploadDir = path.join('uploads');

/* Dynamic storage based on field
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    const { photo, type }= req.body;
    console.log(type)
    if (type === 'startup') folder = 'startup_pics';
    else folder = 'profile_pics';
    const uploadDir = path.join(baseUploadDir, folder);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
*/

const storage = multer.memoryStorage();

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
router.post('/', upload.single('image'),(req, res) => {

if (!req.body.type) {
    return res.status(400).json({ error: 'No image uploaded type is required' });
  }
    const folder = req.body.type === 'startup' ? 'startup_pics' : 'profile_pics';
    
    const uploadPath = path.join(process.cwd(), 'uploads',folder);

    if(!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true});

    const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;

    const fullPath = path.join(uploadPath, filename);

    fs.writeFileSync(fullPath, req.file.buffer);

    res.status(200).json({
    message: 'Image uploaded successfully',
    filename: filename
  });





} );

export default router;


