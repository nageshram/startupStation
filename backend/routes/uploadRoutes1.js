import express from "express";
import multer from "multer";
import fs from "fs";
import { MongoClient, GridFSBucket } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import auth from "../middlewares/auth.js";
dotenv.config();

//const app = express();
const upload = multer({ dest: "uploads/" });  // temp storage on disk before streaming

const uploadRoutes = express.Router();
// MongoDB connection
//const url = "mongodb://localhost:27017";
const dbName = "testdb";
let bucket;

MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: "uploads" });
    console.log("MongoDB connected");
  })
  .catch(err => console.error("MongoDB connect error:", err));

// Route to upload file into GridFS
uploadRoutes.post("/",auth,  upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const filePath = path.join("uploads", req.file.filename);
  const filename = `${Date.now()}-${req.file.originalname}`;

  const uploadStream = bucket.openUploadStream(filename, {
    chunkSizeBytes: 1048576, // 1MB chunks
    metadata: { field: "userid", value: req.user.id },
  });

  fs.createReadStream(filePath)
    .pipe(uploadStream)
    .on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).send("Upload error");
    })
    .on("finish", () => {
      //console.log("File uploaded:", filename);
      fs.unlinkSync(filePath); // cleanup local temp file
      res.json({ fileId: uploadStream.id, filename });
    });
});

uploadRoutes.post("/defaults",  upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const filePath = path.join("uploads", req.file.filename);
  const filename = req.file.originalname;

  const uploadStream = bucket.openUploadStream(filename, {
    chunkSizeBytes: 1048576
  });

  fs.createReadStream(filePath)
    .pipe(uploadStream)
    .on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).send("Upload error");
    })
    .on("finish", () => {
      //console.log("File uploaded:", filename);
      fs.unlinkSync(filePath); // cleanup local temp file
      res.json({ fileId: uploadStream.id, filename });
    });
});

uploadRoutes.get("/:filename", (req, res) => {
  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

  downloadStream.on("error", () => res.status(404).send("File not found"));
  downloadStream.pipe(res);
  downloadStream.on("finish", () => console.log("File sent:", req.params.filename));
  downloadStream.on("end", () => { /*console.log("Download stream ended");*/res.end(); });
});

// Route to download file from GridFS
uploadRoutes.get("/profile_pics/:filename", (req, res) => {
  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

  downloadStream.on("error", () => res.status(404).send("File not found"));
  downloadStream.pipe(res);
  downloadStream.on("finish", () => console.log("File sent:", req.params.filename));
  downloadStream.on("end", () => {/* console.log("Download stream ended");*/res.end(); });
});

uploadRoutes.get("/startup_pics/:filename", (req, res) => {
  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

  downloadStream.on("error", () => res.status(404).send("File not found"));
  downloadStream.pipe(res);
  downloadStream.on("finish", () => console.log("File sent:", req.params.filename));
  downloadStream.on("end", () => { /*console.log("Download stream ended");*/res.end(); });
});


//app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));

export default uploadRoutes;