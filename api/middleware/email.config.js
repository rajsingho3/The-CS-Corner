import nodemailer from 'nodemailer';

 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "engineeringreference7@gmail.com",
    pass: "uxcn cexu nnnz sfyz",
  },
});


export { transporter};