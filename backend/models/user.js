import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    designation: { type: String,
         enum: ['Dev', 'Founder', 'Investor', 'Admin'] , 
         required: true
         },
    phno:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    aadhar:{
        type:String,
        required:true
    },
    photo:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    refreshToken: { 
        type: String, 
        select: false
     },
    otpCode: {
        type:String
    },
    otpExpires: {
        type:Date
    },
    

},{
    timestamps:true
    });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// for login verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ name: 'text', username : 'text' });

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.otpCode;
  delete obj.otpExpires;
  return obj;
};


const User = mongoose.model('User',userSchema);
export default User;