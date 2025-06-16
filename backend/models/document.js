import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ['NDA', 'Equity'] },
  content: String,
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Document = mongoose.model('Document', documentSchema);
export default Document;