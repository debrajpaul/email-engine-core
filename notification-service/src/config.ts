import * as dotenv from "dotenv";
dotenv.config();

const {
  CLIENT_HOST,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env

export const config = {
    smtp: {
      host: CLIENT_HOST||'smtp-mail.outlook.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: CLIENT_ID || 'test@outlook.com',
        pass: CLIENT_SECRET || 'your-pass'
      }
    }
  };
  