import { Resend } from 'resend';
import dotenv from 'dotenv';



dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY)

export  const sendEmail = async (to, subject, html) => {
  try {
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to:to,
      subject:subject,
      html:html,
    });
    if (response.error)
    {
      throw new Error(response.error.message);
    }
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error('Email failed to send');
  }
};

export const contactAdmin = async (name,email,message)=>
{
  try {
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject:`Message from ${name} - Startup stn`,
      text:`From : ${email },\n ${message}`,
    });
  
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
}



