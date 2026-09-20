import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import setAuthCookie from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schema";

const registerHandler = catchErrors(async function (req, res) {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await createAccount(request);
    setAuthCookie({ res, accessToken, refreshToken })
        .status(CREATED)
        .json({ user });
    return;
});

const loginHandler = catchErrors(async function (req, res) {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await loginUser(request);

    setAuthCookie({ res, accessToken, refreshToken })
        .status(OK)
        .json({ message: "Login Successful" });
});

export { registerHandler, loginHandler };
