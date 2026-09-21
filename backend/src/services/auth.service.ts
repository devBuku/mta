import VerificationCodeType from "../constants/verificationCodeTypes";
import { Session } from "../models/session.model";
import { User, UserDocument } from "../models/user.model";
import { VerificationCode } from "../models/verificationCode.model";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import apiAssert from "../utils/apiAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import {
    signToken,
    refreshTokenSignOptions,
    verifyToken,
    RefreshTokenPayload,
} from "../utils/jwt";

type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string | undefined;
};

type CreateAccountResponse = {
    user: Pick<
        UserDocument,
        "_id" | "email" | "verified" | "createdAt" | "updatedAt"
    >;
    accessToken: string;
    refreshToken: string;
};

const createAccount = async function (
    data: CreateAccountParams,
): Promise<CreateAccountResponse> {
    const existingUser = await User.exists({
        email: data.email,
    });

    apiAssert(!existingUser, CONFLICT, "Email already in use");

    const user = await User.create({
        email: data.email,
        password: data.password,
    });

    await VerificationCode.create({
        userId: user._id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow(),
    });

    const session = await Session.create({
        userId: user._id,
        ...(data.userAgent ? { userAgent: data.userAgent } : {}),
    });

    const refreshToken = signToken(
        { sessionId: session._id },
        refreshTokenSignOptions,
    );

    const accessToken = signToken({ userId: user._id, sessionId: session._id });

    return { user: user.omitPassword(), accessToken, refreshToken };
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string | undefined;
};

type LoginUserResponse = {
    user: Pick<
        UserDocument,
        "_id" | "email" | "verified" | "createdAt" | "updatedAt"
    >;
    accessToken: string;
    refreshToken: string;
};

const loginUser = async function (
    data: LoginParams,
): Promise<LoginUserResponse> {
    const user = await User.findOne({ email: data.email });
    apiAssert(user, UNAUTHORIZED, "Invalid Email or Password");

    const isValid = await user.comparePassword(data.password);
    apiAssert(isValid, UNAUTHORIZED, "Invalid Email or Password");

    const userId = user._id;

    const session = await Session.create({
        userId: userId,
        ...(data.userAgent ? { userAgent: data.userAgent } : {}),
    });

    const refreshToken = signToken(
        { sessionId: session._id },
        refreshTokenSignOptions,
    );

    const accessToken = signToken({ userId: user._id, sessionId: session._id });

    return { user: user.omitPassword(), accessToken, refreshToken };
};

const refreshUserAccessToken = async function (refreshToken: string) {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    });
    apiAssert(payload, UNAUTHORIZED, "Invalid Refresh Token");

    const session = await Session.findById(payload.sessionId);
    const now = Date.now();
    apiAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        "Session expired",
    );

    // refresh session if it expires in 24 hours

    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
        ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
        : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id,
    });

    return { accessToken, newRefreshToken };
};

export { createAccount, loginUser, refreshUserAccessToken };
