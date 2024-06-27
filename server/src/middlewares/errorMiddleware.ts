import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong."
    return res
    .status(err.statusCode)
    .json({
        statusCode: err.statusCode,
        message: err.message,
        success: err.success
    });
}