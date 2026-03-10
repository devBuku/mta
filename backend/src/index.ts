import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import connectToDb from "./config/db";

const app = express();

const port = PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser());

app.get("/", function (req, res) {
  res.status(200).json({ status: "healthy" });
});

app.use(errorHandler);

app.listen(port, async function () {
  console.log(`App is listening to port: ${port} in ${NODE_ENV} enviorment`);
  await connectToDb();
});
