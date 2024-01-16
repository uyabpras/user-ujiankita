const nodemailer =  require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
   
    auth: {
      user: 'titikkumpulinovasi@gmail.com',
      pass: 'l3tsg0Br00',
    },
  });

exports.sendVerificationEmail = (user, token) => {
  const verificationLink = `${process.env.base_url}api/user/verify?token=${token}`;
  const mailOptions = {
    from: 'titikkumpulinovasi@gmail.com',
    to: user.email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink} \nDont replay this email`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sent mail', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
