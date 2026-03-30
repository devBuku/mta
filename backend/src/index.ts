import express from "express";
import connectToDb from "./config/db";
import { NODE_ENV, PORT } from "./contants/env";
const app = express();

app.get("/", function (req, res) {
  res.status(200).json({ status: "healthy" });
});

app.listen(PORT, async function () {
  console.log(`App is running on port ${PORT} on ${NODE_ENV} enviorment`);
  await connectToDb();
});
