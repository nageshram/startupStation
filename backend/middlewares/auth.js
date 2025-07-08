import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {

  const accesstoken = req.cookies.accessToken;

  if (!accesstoken) {
    return res.status(401).json({ msg: 'No access token provided' });
  }

  try {
    const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user)
    {
      res.status(400).json({message:"User Not found"});
    }

    req.user = user;
     
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};



export default auth;
