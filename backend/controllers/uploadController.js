import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import { GridFSBucket } from "mongodb";
 
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

export const uploadMedia = (req, res) => {
  // Multer already handled the upload, just respond
//  console.log("Upload media called..");
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({ filename: req.file.filename, message: 'File uploaded successfully' });
};
/*
export const getMedia = (req, res) => {
  if (!gfs) return res.status(500).json({ message: 'GridFS not initialized' });
/*
  const filename = req.params.filename;
  gfs.files.findOne({ filename }, (err, file) => {
    if (err) return res.status(500).json({ message: 'Error finding file' });
    if (!file || file.length === 0) return res.status(404).json({ message: 'File not found' });

    // Check if file is an image (optional)
    if (!file.contentType.startsWith('image/')) {
      return res.status(400).json({ message: 'Not an image file' });
    }

    res.set('Content-Type', file.contentType);

    const readstream = gfs.createReadStream(file.filename);

    readstream.on('error', (err) => {
      // If headers not sent, send error
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });

    readstream.on('end', () => {
      // End the response if not already ended
      if (!res.headersSent) res.end();
    });

    readstream.pipe(res);
  
  });

  try {
    const { filename } = req.params;

    // Check if file exists
    const files = await conn.connection.db
      .collection("uploads.files")
      .find({ filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${filename}"`);

    // Stream file to response
    const downloadStream = gfsBucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




 Route to fetch file by filename
app.get("/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Check if file exists
    const files = await conn.connection.db
      .collection("uploads.files")
      .find({ filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${filename}"`);

    // Stream file to response
    const downloadStream = gfsBucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

/*

import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import express from "express";

const app = express();

// Mongo connection
const conn = await mongoose.connect("mongodb://localhost:27017/mydb");

// Create GridFS bucket instance
let gfsBucket;
conn.connection.once("open", () => {
  gfsBucket = new GridFSBucket(conn.connection.db, {
    bucketName: "uploads" // default is 'fs'
  });
});

// Route to fetch file by filename
app.get("/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Check if file exists
    const files = await conn.connection.db
      .collection("uploads.files")
      .find({ filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${filename}"`);

    // Stream file to response
    const downloadStream = gfsBucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

*/