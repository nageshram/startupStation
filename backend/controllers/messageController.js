import Message from '../models/message.js'
import User from '../models/user.js'

export const sendMessage = async (req, res) => {
  const { chatId, sender, receiver, text } = req.body;
  const message = await Message.create({ chatId, sender, receiver, text });
  res.status(201).json(message);
};

export const getMessagesForChat = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  res.json(messages);
};

export const searchUserChats = async (req, res) => {
  const userId = req.user._id;
  const chats = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      }
    },
    {
      $group: {
        _id: "$chatId",
        lastMessage: { $last: "$text" },
        updatedAt: { $last: "$createdAt" },
        seen: { $last: "$seen" }
      }
    },
    { $sort: { updatedAt: -1 } }
  ]);

  res.json(chats);
};

export const getMessagesWithUser = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: targetId },
      { sender: targetId, receiver: userId }
    ]
  }).sort({ createdAt: 1 });

  // Mark all messages received by current user as seen
  await Message.updateMany({ sender: targetId, receiver: userId, seen: false }, { $set: { seen: true } });

  res.json(messages);
};

export const markAsSeen = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  await Message.updateMany({ chatId, receiver: userId, seen: false }, { $set: { seen: true } });
  res.json({ message: 'Messages marked as seen.' });
};

export const getUserChatList = async (req, res) => {
  const userId = req.user._id;

  const chats = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }]
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: [
            { $eq: ["$sender", userId] },
            "$receiver",
            "$sender"
          ]
        }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: "$otherUser",
        lastMessage: { $first: "$text" },
        seen: { $first: "$seen" },
        chatId: { $first: "$chatId" },
        updatedAt: { $first: "$createdAt" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        chatId: 1,
        lastMessage: 1,
        seen: 1,
        updatedAt: 1,
        user: {
          _id: "$userInfo._id",
          name: "$userInfo.name",
          photo: "$userInfo.photo",
          designation: "$userInfo.designation"
        }
      }
    },
    {
      $sort: { updatedAt: -1 }
    }
  ]);

  res.json(chats);
};

/*

Each object contains:
chatId
lastMessage
seen
updatedAt
user: { _id, name, photo, designation }

*/