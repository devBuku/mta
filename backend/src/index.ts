import "dotenv/config"
import express from "express"
import { NODE_ENV, PORT } from "./constants/env.js";
import connectToDb from "./config/db.js";

const app = express();

app.get("/health", (_, res) => {
  res.status(200).json({ status : "Healthy"})
})

const port = PORT

const startServer = async () => {
  await connectToDb();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port} in ${NODE_ENV} environment`);
  })
}

startServer();

