import express from "express";
import { MongoClient, GridFSBucket } from "mongodb";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();  
const dbName = "test";
let bucket;

MongoClient.connect(process.env.MONGO_URI)
  .then(client => {
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: "uploads" });
    console.log("MongoDB connected");
  })
  .catch(err => console.error(err));

router.post("/upload", (req, res) => {
  const filename = req.file.filename+ "-"+Date.now(); 
  const uploadStream = bucket.openUploadStream(filename);

  req.pipe(uploadStream) // directly stream request body to GridFS
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Error uploading file");
    })
    .on("finish", () => {
      res.status(200).json({message: "File uploaded successfully", filename: filename});
    });
});


router.get("/profile_pics/:filename", (req, res) => {
  bucket.openDownloadStreamByName(req.params.filename)
    .pipe(res)
    .on("error", () => res.status(404).send("File not found"));
});


router.get("/startup_pics/:filename", (req, res) => {
  bucket.openDownloadStreamByName(req.params.filename)
    .pipe(res)
    .on("error", () => res.status(404).send("File not found"));
});

export default router;