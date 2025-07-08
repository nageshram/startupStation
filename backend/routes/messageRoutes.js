import express from 'express'
const router = express.Router();
import {sendMessage, getMessagesForChat, getMessagesWithUser, markAsSeen, getUserChatList, searchUsers } from '../controllers/messageController.js'
import auth  from '../middlewares/auth.js' 

router.post('/', auth,  sendMessage);
router.get('/:chatId', auth,  getMessagesForChat);
router.get('/with/:username', auth,  getMessagesWithUser);
router.put('/seen/:chatId', auth,  markAsSeen);
router.get('/contact/chatlist', auth,  getUserChatList);
router.get('/search/users', auth,  searchUsers); // new

export default router;

//Show user.name, user.photo, lastMessage

//Show blue dot if seen == false

//Tap it to load /with/:userId messages

