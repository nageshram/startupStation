import Message from '../models/message.js'
import User from '../models/user.js'

export const sendMessage = async (req, res) => {
  const { chatId, receiver, text } = req.body;
  const sender = req.user.username;
  const message = await Message.create({ chatId, sender, receiver, text });
  res.status(201).json(message);
};

export const getMessagesForChat = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  res.json(messages);
};

export const getMessagesWithUser = async (req, res) => {
  const user = req.user.username;
  const target = req.params.username;

  const chatId = [user, target].sort().join('_');
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  // Mark all messages received by current user as seen
  await Message.updateMany({ chatId, receiver: user, seen: false }, { $set: { seen: true } });

  res.json(messages);
};

export const markAsSeen = async (req, res) => {
  const { chatId } = req.params;
  const username = req.user.username;

  await Message.updateMany({ chatId, receiver: username, seen: false }, { $set: { seen: true } });
  res.json({ message: 'Messages marked as seen.' });
};

export const getUserChatList = async (req, res) => {
  //console.log("HIT /chatlist"); // <--- Should always print if endpoint is hit
  const username = req.user.username;

  //console.log("Current user for chatlist:", username); // DEBUG
  const chats = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: username }, { receiver: username }]
      }
    },
    {
      $addFields: {
        chatKey: {
          $cond: [
            { $gt: ["$sender", "$receiver"] },
            { $concat: ["$receiver", "_", "$sender"] },
            { $concat: ["$sender", "_", "$receiver"] }
          ]
        },
        otherUser: {
          $cond: [
            { $eq: ["$sender", username] },
            "$receiver",
            "$sender"
          ]
        }
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$chatKey",
        lastMessage: { $first: "$text" },
        seen: { $first: { $cond: [{ $eq: ["$receiver", username] }, "$seen", true] } },
        chatId: { $first: "$chatId" },
        updatedAt: { $first: "$createdAt" },
        otherUser: { $first: "$otherUser" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "otherUser",
        foreignField: "username",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        chatId: 1,
        lastMessage: 1,
        seen: 1,
        updatedAt: 1,
        user: {
          username: "$userInfo.username",
          name: "$userInfo.name",
          photo: "$userInfo.photo",
          designation: "$userInfo.designation"
        }
      }
    },
    { $sort: { updatedAt: -1 } }
  ]);

 //console.log( "Chats found:"+chats); // DEBUG
  res.json(chats);
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    username: { $regex: q, $options: 'i' }
  }).select('username name photo designation');
  res.json(users);
};