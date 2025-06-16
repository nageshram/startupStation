import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import taskRoutes from './routes/taskRoutes.js';
import startupRoutes from './routes/startupRoutes.js'
import documentRoutes from './routes/documentRoutes.js'

import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/upload', uploadRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/requests', requestRoutes);
app.use('/tasks', taskRoutes);
app.use('/startup', startupRoutes);
app.use('/documents', documentRoutes)



app.get("/", (req, res)=>{
    res.send("Server is ready");
});

//console.log(process.env.MONGO_URI);
const port = process.env.PORT || 5000;

app.listen(port,()=>{
    connectDB();
    console.log("Server running at http://localhost:"+ port);
});

