import mongoose from "mongoose";

const devProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  github: String,
  experience: String,
  portfolioLink: String,
  desc:String,
  status:String
});

devProfileSchema.index({ skills: 'text' });

const DevProfile = mongoose.model('DevProfile', devProfileSchema);
export default DevProfile;