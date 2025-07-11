import User from '../models/user.js';
import Startup from '../models/startup.js';
import DevProfile from '../models/devprofile.js';

export const suggestForFounder = async (req, res) => {
  const username = req.user.username;
  const startup = await Startup.findOne({ 'founderId.username': username });
  if (!startup) return res.json({ devs: [], investors: [] });

  // Match devs by skills or desc with startup's openedRoles or desc
  const devProfiles = await DevProfile.find({
    $or: [
      { skills: { $in: startup.openedRoles } },
      { desc: { $regex: startup.desc, $options: 'i' } }
    ],
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

  // Match startups by desc or openedRoles with dev's skills or desc
  const startups = await Startup.find({
    $or: [
      { openedRoles: { $in: devProfile.skills } },
      {
        desc: { $regex: devProfile.desc, $options: 'i' }
      }
    ]
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
    $expr: { $eq: [ { $size: "$openedRoles" }, 0 ] }
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