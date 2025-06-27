import express from 'express'
const router = express.Router();
import {sendMessage, getMessagesForChat, searchUserChats, getMessagesWithUser, markAsSeen, getUserChatList } from '../controllers/messageController.js'
import auth  from '../middlewares/auth.js' 

router.post('/', auth,  sendMessage);
router.get('/:chatId', auth,  getMessagesForChat);
router.get('/', auth,  searchUserChats);
router.get('/with/:userId', auth,  getMessagesWithUser);
router.put('/seen/:chatId', auth,  markAsSeen);
router.get('/:userId/chatlist', auth,  getUserChatList);

export default router;

//Show user.name, user.photo, lastMessage

//Show blue dot if seen == false

//Tap it to load /with/:userId messages

