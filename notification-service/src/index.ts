import cors from "cors";
import express from 'express';
import swaggerSpec from "./swagger-docs";
import swaggerUi from "swagger-ui-express";
import notifyRouter from './controllers/notificationController';
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

process.on("uncaughtException", (ex) => {
  console.error("Error uncaughtException! Please check the fields attributes", ex);
  // process.exit(1);
});
process.on("unhandledRejection", (ex) => {
  console.error("Error unhandledRejection! Please check the fields attributes", ex);
  //process.exit(1);
});

/** Log the request */
app.use((req, res, next) => {
  console.error(
    "app:user:API_server",
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    console.error(
      "app:user:API_server",
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });
  next();
});

app.use(cors());
app.use(express.json());
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/notify', notifyRouter);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
