import express from 'express'
const router = express.Router();
import { contactAdmin } from '../utils/sendEmail.js';


router.post('/message',async (req, res) => {
  
    const { name, email, message } = req.body;
        console.log("incoming req : ",req.body);
    if (!name || !email || !message )
       { console.log("no values provided for contact form");
        return res.status(400).json({message :"Fields must not be empty!.."});}

    try{
        await contactAdmin(name, email, message);
        res.status(200).json({message:"Message sent to admin Successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"Server error : Can't send message right now!", error:err.message});

    }

} );

export default router;