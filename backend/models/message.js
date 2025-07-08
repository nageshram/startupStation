import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },   // username
  receiver: { type: String, required: true }, // username
  text: { type: String, required: true },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ chatId: 1 });
messageSchema.index({ createdAt: -1 }); // for sorting messages by date

const Message = mongoose.model('Message', messageSchema);
export default Message;