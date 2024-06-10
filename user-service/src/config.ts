import * as dotenv from "dotenv";
dotenv.config();

const {
  JWT_SECRET,
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_REDIRECT_URL,
} = process.env

export const config = {
    outlook: {
      baseUrl:BASE_URL||"https://login.microsoftonline.com/common/oauth2/v2.0",
      clientId: CLIENT_ID||'c0095bc4-fc49-4d3c-9d5f-16ebb09a9885',
      clientSecret: CLIENT_SECRET || "YOUR_SECRET",
      redirectUri: CLIENT_REDIRECT_URL || "http://localhost:3004/users/outlook-callback"
    },
    jwtSecret: JWT_SECRET || 'YOUR_JWT_SECRET'
  };
  