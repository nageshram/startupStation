import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import uploadRoutes from './routes/uploadRoutes1.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import initSocketServer from './sockets/socketServer.js';
import suggestionRoutes from './routes/suggestionsRoute.js';
import { initNotificationSocket } from './sockets/notificationSocket.js';
import contactAdminRoute from './routes/contactRoute.js'
import searchRoute from './routes/searchRoutes.js'
import { Server } from 'socket.io'
import http from 'http';
import cors from 'cors'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser  from 'cookie-parser'
import analyticsRoutes from './routes/analyticsRoutes.js'
import mongoose from 'mongoose';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
  origin:process.env.ORIGIN_URL,
  credentials:true
  }
});
app.use(cors({
  origin:process.env.ORIGIN_URL,
  credentials:true,
}));

app.use(cookieParser())

app.use(express.json());


app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/startup', startupRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoute);
app.use('/api/contactadmin', contactAdminRoute );
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/analytics', analyticsRoutes);


initSocketServer(io);         // Messages
initNotificationSocket(io);  //  Notifications


app.get("/", (req, res)=>{
    res.send("Server is ready");
});



//console.log(process.env.MONGO_URI);
const port = process.env.PORT || 5000;
server.listen(port,()=>
{ 
  connectDB();  
  console.log("Server is running at "+ port)
})

