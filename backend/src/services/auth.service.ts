import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeTypes";
import { Session } from "../models/session.model";
import { User, UserDocument } from "../models/user.model";
import { VerificationCode } from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import apiAssert from "../utils/apiAssert";
import { CONFLICT } from "../constants/http";

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

    const refreshToken = jwt.sign(
        { sessionId: session._id },
        JWT_REFRESH_SECRET,
        { expiresIn: "30d", audience: ["user"] },
    );

    const accessToken = jwt.sign(
        { userId: user._id, sessionId: session._id },
        JWT_SECRET,
        { expiresIn: "15m", audience: ["user"] },
    );
    return { user: user.omitPassword(), accessToken, refreshToken };
};

export { createAccount };
