//import dotenv from 'dotenv';
import { io } from 'socket.io-client';
//dotenv.config();

// Automatically connects with backend Socket.IO server
const socket = io('http://localhost:5600' , {
  withCredentials: true,
  autoConnect: true, // Automatically connects
  transports: ['websocket'],
});

export default socket;
