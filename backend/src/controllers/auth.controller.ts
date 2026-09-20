import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import { createAccount } from "../services/auth.service";
import { CREATED } from "../constants/http";
import setAuthCookie from "../utils/cookies";

const registerSchema = z
    .object({
        email: z.email().min(1).max(255),
        password: z.string().min(6).max(255),
        confirmPassword: z.string().min(6).max(255),
        userAgent: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords does not match",
        path: ["confirmPassword"],
    });

const registerHandler = catchErrors(async function (req, res) {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await createAccount(request);
    setAuthCookie({ res, accessToken, refreshToken })
        .status(CREATED)
        .json({ user: { email: user.email } });
    return;
});

export { registerHandler };
