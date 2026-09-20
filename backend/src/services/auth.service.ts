import VerificationCodeType from "../constants/verificationCodeTypes";
import { Session } from "../models/session.model";
import { User, UserDocument } from "../models/user.model";
import { VerificationCode } from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import apiAssert from "../utils/apiAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import signToken, { refreshTokenSignOptions } from "../utils/jwt";

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

export { createAccount, loginUser };
