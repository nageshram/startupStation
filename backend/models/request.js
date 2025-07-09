import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  targetRoleId: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String, enum: ['job', 'job-proposal', 'invest', 'invest-proposal','resignation'], required: true },
  category: { type: String, enum: ['job', 'invest','resign'], required: true },
  desc: { type: String },
  rolename:{ type:String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' }
}, { timestamps: true });


const Request= mongoose.model('Request', requestSchema);
export default Request;