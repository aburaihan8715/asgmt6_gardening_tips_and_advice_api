// import nodemailer from 'nodemailer';
// import config from '../config';

// export const sendEmail = async (to: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: config.NODE_ENV === 'production',
//     auth: {
//       user: 'aburaihan8715@gmail.com',
//       pass: 'sfdc gmeu pdxl upwy',
//     },
//   });

//   await transporter.sendMail({
//     from: 'aburaihan8715@gmail.com',
//     to,
//     subject: 'Reset your password within 10 minute!',
//     text: '',
//     html,
//   });
// };

import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: config.NODE_ENV === 'production' ? 465 : 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  await transporter.sendMail({
    from: 'raihan@gmail.com',
    to,
    subject: 'Reset your password within 10 minutes!',
    text: '',
    html,
  });
};
