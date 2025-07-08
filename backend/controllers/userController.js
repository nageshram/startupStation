import User from '../models/user.js'
import DevProfile from '../models/devprofile.js';
import Startup from '../models/startup.js';

export const checkUserName = async (req, res)=>
{
    const { username } = req.body;

    if(!username) return res.status(400).json({message:'username required'});

    const exists = await User.findOne({ username });
    return res.status(200).json({available:! exists})
}

export const checkEmail = async (req, res)=>
{
    const { email } = req.body;

    if(!email) return res.status(400).json({message:'email required'});

    const exists = await User.findOne({ email });
    return res.status(200).json({available:! exists})
}

export const addUser = async (req, res )=>{

    try{
    const newUser = new User(req.body);

    const saved = await newUser.save();
    res.status(201).json(saved);
    }
    catch(error)
    {
        if(error.code==11000)
            return res.status(409).json({message:"username already exists"});

    
        res.status(409).json({message:error.message});

    }
}

export const getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.status(200).json(users);
}

export const getSingleUser = async (req, res) =>{

    try{

        const user = await User.findById(req.user.id);
        if (user.designation === "Founder") {
        const startupId = await Startup.findOne({ founderId: req.user.id })
              .populate('founderId', '-password')
              .populate('investors', '-password')
              .populate('documentIds')
              .populate('taskGroup')
              .populate('requestGroup')
              .populate('teamId').populate('teamId.roles');
        
        if (startupId)
        {
          //console.log("Startup ID found:", startupId.toJSON());
          const additionalData ={
            ...user.toObject(),
            startupId
          }
         return res.status(200).json(additionalData);
        }
        }
        if( user.designation === "Dev")
        {
          const dev = await DevProfile.findOne({ user: user.id })
            .populate('user')
            .populate('skills')
            .populate('desc');
            if(dev)
            {
              return res.status(200).json({ ...user.toObject(),dev});
            }
        }
        res.status(200).json(user)
    }
    catch(err)
    {
        res.status(400).json({message:err.message});
    }
}

export const updateUser = async (req,res) => {

    try{
        const updated = await User.findByIdAndUpdate(req.user.id,
      { $set: req.body },
      { new: true });
        if(!updated)
        {
            res.status(404).json({message:"user not found "});
        }
        res.status(200).json(updated);
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    } 
}
export const updateUserPatch = async (req,res) => {

    try{
        const updated = await User.findByIdAndUpdate(req.user.id,
        {$set: req.body},
      { new: true});
        if(!updated)
        {
            res.status(404).json({message:"user not found "});
        }
        res.status(200).json(updated);
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    } 
}
export const deleteUser = async (req,res) => {

    try{
        const deleted = await User.findByIdAndDelete(req.user.id);
        if(!deleted)
        {
            res.status(404).json({message:"user not found "});
        }
        res.status(200).json(deleted);
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}

export const createOrUpdateDevProfile = async (req, res) => {
  const userId = req.user.id; // from JWT auth middleware
  const { skills, github, experience, portfolioLink, desc } = req.body;

  try {
    let profile = await DevProfile.findOne({ user: userId });

    if (profile) {
      // Update
      profile.skills = skills;
      profile.github = github;
      profile.experience = experience;
      profile.portfolioLink = portfolioLink;
      profile.desc = desc;
      await profile.save();
    } else {
      // Create
      profile = await DevProfile.create({
        user: userId,
        skills,
        github,
        experience,
        portfolioLink,
        desc
      });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDevProfile = async (req, res) => {
  const userId = req.user.id; // from JWT auth middleware

  try {
    const profile = await DevProfile.findOne({ user: userId }).populate('user', 'name username photo designation'); 
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }   
    res.status(200).json(profile);
  } catch (err) {       
    res.status(500).json({ message: 'Server error' });
  }


}

