//import dotenv from 'dotenv';
import { io } from 'socket.io-client';
//dotenv.config();

const BASE_URL = import.meta.env.VITE_API_URL
// Automatically connects with VITE Socket.IO server
const socket = io(`${BASE_URL}` , {
  withCredentials: true,
  autoConnect: true, // Automatically connects
  transports: ['websocket'],
});

export default socket;
