import User from '../models/user.js';
import DevProfile from '../models/devprofile.js';
import Startup from '../models/startup.js';

export const search = async (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) return res.status(400).json({ error: "Query missing" });

  const results = {
    devs: [],
    startups: [],
    investors: []
  };

  try {
    //1. Search Devs by Skill via DevProfile
    const devProfiles = await DevProfile.find({
      skills: { $regex: query, $options: 'i' }
    }).populate({
      path: 'user',
      match: { designation: 'Dev' },
      select: 'name username photo'
    });

    results.devs = devProfiles
      .filter(profile => profile.user) // Ensure user matched
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

    //  2. Search Startups by Name
    results.startups = await Startup.find({
      name: { $regex: query, $options: 'i' }
    }).select('name photo status');

    // 3. Search Investors by Name or Username
    results.investors = await User.find({
      designation: 'Investor',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).select('name username photo');

    res.json(results);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ error: "Server error" });
  }
};
