import assert from "node:assert";
import ApiError from "./apiError";
import { HttpStatusCode } from "../constants/http";
import ApiErrorCode from "../constants/apiErrorCode";

type ApiAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    apiErrorCode?: ApiErrorCode,
) => asserts condition;

/**
 * Asserts a condition and throws an ApiError if the condition is falsy
 */

const apiAssert: ApiAssert = function (
    condition,
    httpStatusCode,
    message,
    apiErrorCode,
) {
    return assert(
        condition,
        new ApiError(httpStatusCode, message, apiErrorCode),
    );
};

export default apiAssert;
