import * as dotenv from "dotenv";
dotenv.config();

const {
  JWT_SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_REDIRECT_URL,
  CLIENT_ELASTIC_SEARCH,
} = process.env

export const config = {
    outlook: {
      clientId: CLIENT_ID||'c0095bc4-fc49-4d3c-9d5f-16ebb09a9885',
      clientSecret: CLIENT_SECRET|| 'YOUR_SECRET',
      redirectUri: CLIENT_REDIRECT_URL ||'http://localhost:3004/users/outlook-callback'
    },
    elasticsearch: {
      node: CLIENT_ELASTIC_SEARCH||'http://localhost:9200'
    },
    jwtSecret: JWT_SECRET||'YOUR_JWT_SECRET'
  };
  