import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SEND_EMAIL_ADDRESS,
    pass: process.env.SEND_EMAIL_PASSWORD,
  },
});

export default transport;