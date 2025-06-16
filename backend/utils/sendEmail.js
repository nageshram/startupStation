import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nnagi88844@gmail.com',     
        pass: 'your-app-password',         // generate from Gmail > App Passwords
      },
    });

    const mailOptions = {
      from: '"Startup Station" <nnagi88844@gmail.com>', 
      to: to,                                          
      subject: subject,
      html: html,                                      
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error('Email failed to send');
  }
};

export default sendEmail;
