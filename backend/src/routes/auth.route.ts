import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerHandler);

export default authRouter;
