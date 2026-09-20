import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};

const getAccessTokenCookieOptions = function (): CookieOptions {
    return {
        ...defaults,
        expires: fifteenMinutesFromNow(),
    };
};

const getRefreshTokenCookieOptions = function (): CookieOptions {
    return {
        ...defaults,
        expires: thirtyDaysFromNow(),
        path: "/auth/refresh",
    };
};

type SetAuthCookieParams = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

const setAuthCookie = function (data: SetAuthCookieParams) {
    return data.res
        .cookie("accessToken", data.accessToken, getAccessTokenCookieOptions())
        .cookie(
            "refreshToken",
            data.refreshToken,
            getRefreshTokenCookieOptions(),
        );
};

export default setAuthCookie;
