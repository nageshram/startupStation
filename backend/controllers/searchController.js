import User from '../models/user.js';
import DevProfile from '../models/devprofile.js';
import Startup from '../models/startup.js';

export const search = async (req, res) => {
  const query = req.params.q?.toLowerCase();

  if (!query) return res.status(400).json({ error: "Query missing" });

  const results = {
    devs: [],
    startups: [],
    investors: [],
    founders: []
  };

  try {
    // 1. Search Devs by Skill, Desc, Name (DevProfile), or Username/Name (User)
    // First, find all dev users matching username or name
    const devUsers = await User.find({
      designation: 'Dev',
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).select('_id');

    const devUserIds = devUsers.map(u => u._id);

    const devProfiles = await DevProfile.find({
      $or: [
        { skills: { $regex: query, $options: 'i' } },
        { desc: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { user: { $in: devUserIds } }
      ]
    }).populate({
      path: 'user',
      match: { designation: 'Dev' },
      select: 'name username photo desc skills github experience'
    });

    results.devs = devProfiles
      .filter(profile => profile.user)
      .map(profile => ({
        _id: profile.user._id,
        name: profile.user.name,
        username: profile.user.username,
        photo: profile.user.photo,
        skills: profile.skills,
        github: profile.github,
        experience: profile.experience,
        desc: profile.desc,
      }));

    // 2. Search Startups by Name, Desc, or OpenedRoles
    results.startups = await Startup.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { desc: { $regex: query, $options: 'i' } },
        { openedRoles: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name photo status openedRoles desc founderId teamId')
      .populate('founderId', 'name username photo designation')
      .populate({ path: 'teamId', populate: { path: 'roles' } });

    // 3. Search Investors by Name or Username
    results.investors = await User.find({
      designation: 'Investor',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).select('name username photo designation');

    // 4. Search Founders by Name or Username
    results.founders = await User.find({
      designation: 'Founder',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).select('name username photo designation');

    res.json(results);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ error: "Server error" });
  }
};
