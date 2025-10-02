import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
dotenv.config();
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return { filename: `${Date.now()}-${file.originalname}`, bucketName : "uploads" };
          }

});
const upload = multer({ storage });
export default upload;