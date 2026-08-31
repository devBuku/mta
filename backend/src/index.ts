import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Express, Request, Response } from "express";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import connectDb from "./config/db";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get(
  "/health",
  function (req: Request, res: Response<{ status: string }>): void {
    res.status(200).json({ status: `I am healthy` });
  },
);

app.use(function (req: Request, res: Response<{ message: string }>) {
  res.status(404).json({ message: `Route Not Found!!` });
});

async function startServer() {
  await connectDb();
  app.listen(PORT, function (): void {
    console.log(
      `Server is listening on port: ${PORT} in ${NODE_ENV} environment`,
    );
  });
}

startServer();
