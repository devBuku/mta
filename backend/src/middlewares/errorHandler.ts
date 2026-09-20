import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import ApiError from "../utils/apiError";

const handleZodError = function (res: Response, error: z.ZodError) {
    const errors = error.issues.map(function (issue) {
        return { path: issue.path.join("."), message: issue.message };
    });
    return res.status(BAD_REQUEST).json({ message: error.message, errors });
};

const handleApiError = function (res: Response, error: ApiError) {
    return res
        .status(error.statusCode)
        .json({ message: error.message, errorCode: error.errorCode });
};

const errorHandler: ErrorRequestHandler = function (
    error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(`PATH: ${req.path}, ERROR: ${error}`);
    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }

    if (error instanceof ApiError) {
        return handleApiError(res, error);
    }

    return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: `Internal Server Error` });
};

export default errorHandler;
