import * as dotenv from "dotenv";
dotenv.config();

const {
  CLIENT_ELASTIC_SEARCH,
} = process.env

export const config = {
  elasticsearch: {
    node: CLIENT_ELASTIC_SEARCH||'http://localhost:9200'
  }
};
