import User from '../models/user.js';
import Startup from '../models/startup.js';
import DevProfile from '../models/devprofile.js';

export const suggestForFounder = async (req, res) => {
  const username = req.user.username;
  const startup = await Startup.findOne({ 'founderId.username': username });
  if (!startup) return res.json({ devs: [], investors: [] });

  // Split startup openedRoles and desc into words for matching
  const roleWords = Array.isArray(startup.openedRoles)
    ? startup.openedRoles.flatMap(r => r.split(/\s+/))
    : [];
  const descWords = startup.desc ? startup.desc.split(/\s+/) : [];
  const allWords = [...roleWords, ...descWords].filter(Boolean);

  // Build $or array for matching any word in dev skills or desc
  const orConditions = [
    ...allWords.map(word => ({ skills: { $regex: word, $options: 'i' } })),
    ...allWords.map(word => ({ desc: { $regex: word, $options: 'i' } }))
  ];

  const devProfiles = await DevProfile.find({
    $or: orConditions,
    status: { $ne: 'hired' }
  }).populate('user', 'username name photo');

  // Random investors
  const investors = await User.aggregate([
    { $match: { designation: 'Investor' } },
    { $sample: { size: 2 } },
    { $project: { username: 1, name: 1, photo: 1 } }
  ]);

  res.json({
    devs: devProfiles.slice(0, 2).map(d => ({
      _id: d.user._id,
      username: d.user.username,
      name: d.user.name,
      photo: d.user.photo,
      skills: d.skills
    })),
    investors
  });
};

export const suggestForDev = async (req, res) => {
  const devProfile = await DevProfile.findOne({ user: req.user.id });
  if (!devProfile) return res.json({ startups: [] });

  // Split dev skills and desc into words for matching
  const skillWords = Array.isArray(devProfile.skills)
    ? devProfile.skills.flatMap(s => s.split(/\s+/))
    : [];
  const descWords = devProfile.desc ? devProfile.desc.split(/\s+/) : [];
  const allWords = [...skillWords, ...descWords].filter(Boolean);

  // Build $or array for matching any word in desc or openedRoles
  const orConditions = [
    ...allWords.map(word => ({ desc: { $regex: word, $options: 'i' } })),
    ...allWords.map(word => ({ openedRoles: { $regex: word, $options: 'i' } }))
  ];

  const startups = await Startup.find({
    $or: orConditions
  }).populate('founderId', 'username name photo');

  res.json({
    startups: startups.slice(0, 2).map(s => ({
      _id: s._id,
      name: s.name,
      photo: s.photo,
      founder: s.founderId ? {
        username: s.founderId.username,
        name: s.founderId.name,
        photo: s.founderId.photo
      } : null
    }))
  });
};

export const suggestForInvestor = async (req, res) => {
  // Example: startups where all roles are hired 
  const startups = await Startup.find({
    //$expr: { $eq: [ { $size: "$openedRoles" },2 ] }
  }).populate('founderId', 'username name photo');

  res.json({
    startups: startups.slice(0, 2).map(s => ({
      _id: s._id,
      name: s.name,
      photo: s.photo,
      founder: s.founderId ? {
        username: s.founderId.username,
        name: s.founderId.name,
        photo: s.founderId.photo
      } : null
    }))
  });
};