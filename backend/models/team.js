import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { _id: true });

const teamSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  roles: [roleSchema]
});
const Team= mongoose.model('Team', teamSchema);
export default Team;