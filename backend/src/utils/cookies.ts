import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = NODE_ENV !== "development";
export const REFRESH_PATH = "/auth/refresh";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};

export const getAccessTokenCookieOptions = function (): CookieOptions {
    return {
        ...defaults,
        expires: fifteenMinutesFromNow(),
    };
};

export const getRefreshTokenCookieOptions = function (): CookieOptions {
    return {
        ...defaults,
        expires: thirtyDaysFromNow(),
        path: REFRESH_PATH,
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

const clearAuthCookie = function (res: Response) {
    return res.clearCookie("accessToken").clearCookie("refreshToken", {
        path: REFRESH_PATH,
    });
};

export { setAuthCookie, clearAuthCookie };
