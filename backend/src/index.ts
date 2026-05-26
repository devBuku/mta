import express, { urlencoded } from "express";
import cors from "cors";
import connectToDb from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import catchErrors from "./utils/catchError";
import { OK } from "./constants/http";
import authRouter from "./routes/auth.route";

const app = express();
const port = PORT;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(OK).json({ status: "Healthy" });
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(port, async function () {
  console.log(`Server is running on port ${port} in ${NODE_ENV} enviorment `);
  await connectToDb();
});
