import express from 'express'
const router = express.Router();
import messageController from '../controllers/messageController.js'
import { auth } from '../middlewares/auth.js' 

router.post('/', auth, messageController.sendMessage);
router.get('/:chatId', auth, messageController.getMessagesForChat);
router.get('/', auth, messageController.searchUserChats);
router.get('/with/:userId', auth, messageController.getMessagesWithUser);
router.put('/seen/:chatId', auth, messageController.markAsSeen);
router.get('/:userId/chatlist', auth, messageController.getUserChatList);

export default router;

//Show user.name, user.photo, lastMessage

//Show blue dot if seen == false

//Tap it to load /with/:userId messages

