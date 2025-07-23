import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: { type: String,enum :['pending','in-progress','completed'], default: 'pending' },
  remarks: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }
});
const Task = mongoose.model('Task', taskSchema);
export default Task;
