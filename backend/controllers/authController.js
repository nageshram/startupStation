import User from '../models/user.js';
import jwt from 'jsonwebtoken'
import {sendEmail}  from '../utils/sendEmail.js'

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username , role:user.designation }, JWT_SECRET, { expiresIn: '2h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role:user.designation }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
  try {
    //console.log("incoming request : "+res.body);
    const user = new User(req.body);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    const accessToken = generateAccessToken(user);
    
    res.cookie('accessToken', accessToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:60*60*1000
  }).cookie('refreshToken', refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:7*24*60*60*1000
  }).status(200).json({"message":"Signup Successfull!"});

} 
  
  catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials password not Matched' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:60*60*1000
  }).cookie('refreshToken', refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:7*24*60*60*1000
  }).status(200).json({"message":"Login Successful"});
};

//receive refresh token to allocate new access token
export const refreshToken = async (req, res) => {
  const refreshToken  = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
   
  res.cookie('accessToken', newAccessToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none',// change it Strict after deployment over HTTPS
    maxAge:60*60*1000
  }).cookie('refreshToken', newRefreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:7*24*60*60*1000
  })
  .json({"message":"Refresh Token Renewed"});

  } catch (err) {
    res.status(403).json({ message: 'Token expired or invalid' });
  }
};

export const logout = async (req, res) => {
   
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = null;
    await user.save();

    res.clearCookie('accessToken', req.cookies.accessToken, {
    httpOnly:true,
    secure:true,
    sameSite:'none'});

   res.clearCookie('refreshToken', refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:'none'
  });
     res.status(200).json({ message: 'Logged out successfully' });
  }
 
};



//  Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


// 1. SEND Otp
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min validity
    await user.save();

    const message = `
      <h2>Password Reset OTP</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    await sendEmail(user.email, 'Startup stn - Your OTP for Password Reset', message);

    res.status(200).json({ message: 'OTP sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


export const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

export const loginStatus = async (req, res) => {
  // If auth middleware passes, user is logged in
  if(req.user.id) res.json({ loggedIn: true, user: req.user });
  res.json({ loggedIn: false, user: req.user });
};

