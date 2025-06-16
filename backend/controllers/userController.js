import User from '../models/user.js'
import DevProfile from '../models/devprofile.js';

export const checkUserName = async (req, res)=>
{
    const { username } = req.query;

    if(!username) return res.status(400).json({message:'username required'});

    const exists = await User.findOne({ username });
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

        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    }
    catch(err)
    {
        res.status(400).json({message:err.message});
    }
}

export const updateUser = async (req,res) => {

    try{
        const updated = await User.findByIdAndUpdate(req.params.id,req.body);
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
        const deleted = await User.findByIdAndDelete(req.params.id);
        if(!deleted)
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


export const createOrUpdateDevProfile = async (req, res) => {
  const userId = req.user.id; // from JWT auth middleware
  const { skills, github, experience } = req.body;

  try {
    let profile = await DevProfile.findOne({ user: userId });

    if (profile) {
      // Update
      profile.skills = skills;
      profile.github = github;
      profile.experience = experience;
      await profile.save();
    } else {
      // Create
      profile = await DevProfile.create({
        user: userId,
        skills,
        github,
        experience
      });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

