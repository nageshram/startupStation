import mongoose from "mongoose";

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: String,
  desc: String,
  status: { type: String, default: 'active' },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  investors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  openedRoles: [String],
  documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  taskGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  requestGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
}, { timestamps: true });

/*  Indexes for fast queries */
startupSchema.index({ founderId: 1 }); // fast lookup of startups by founder
startupSchema.index({ "investors": 1 }); // useful for tracking startups an investor is involved in
startupSchema.index({ "openedRoles": 1 }); // for role-matching search (e.g., devs browsing open roles)
startupSchema.index({ "status": 1 }); // for dashboards showing active/archived startups
startupSchema.index({ "name": "text", "desc": "text" }); // for search functionality

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;
