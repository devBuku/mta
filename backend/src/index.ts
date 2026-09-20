import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Express, Response } from "express";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { connectToDb } from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import { NOT_FOUND, OK } from "./constants/http";
import authRouter from "./routes/auth.route";

const app: Express = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    }),
);
app.use(cookieParser());

app.get("/health", function (_req, res: Response<{ message: string }>): void {
    res.status(OK).json({ message: `I am healthy` });
});

app.use("/auth", authRouter);

app.use(errorHandler);

app.use(function (_req, res: Response<{ message: string }>) {
    res.status(NOT_FOUND).json({ message: `Route not found` });
});

(async function () {
    try {
        await connectToDb();
        app.listen(PORT, function () {
            console.log(`Server is running on port: ${PORT} in ${NODE_ENV}`);
        });
    } catch (error) {
        console.error(`Error in starting the server: ${error}`);
        process.exit(1);
    }
})();
