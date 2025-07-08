import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // Return folder info for frontend
  const folder = req.body.type === 'startup' ? 'startup_pics' : 'profile_pics';
  res.json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    filePath: `/uploads/${folder}/${req.file.filename}`,
    folder,
  });
};

export const getImage = (req, res) => {
  const { folder, id } = req.params;
  const imagePath = path.join(uploadDir, folder, id);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: `image not found ${imagePath}` });
  }
};