import catchErrors from "../utils/catchErrors";
import {
    createAccount,
    loginUser,
    refreshUserAccessToken,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
    setAuthCookie,
    clearAuthCookie,
    getAccessTokenCookieOptions,
} from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schema";
import { verifyToken } from "../utils/jwt";
import { Session } from "../models/session.model";
import apiAssert from "../utils/apiAssert";

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

const logoutHandler = catchErrors(async function (req, res) {
    const accessToken = req.cookies.accessToken as string | undefined;

    const { payload } = verifyToken(accessToken || "");

    if (payload) {
        await Session.findByIdAndDelete(payload.sessionId);
    }

    clearAuthCookie(res).status(OK).json({ message: "Logout successful" });
});

const refreshHandler = catchErrors(async function (req, res) {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    apiAssert(refreshToken, UNAUTHORIZED, "Missing Refresh Token");

    const { accessToken, newRefreshToken } =
        await refreshUserAccessToken(refreshToken);

    res.status(OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({ message: `Access Token Refreshed` });
});

export { registerHandler, loginHandler, logoutHandler, refreshHandler };
