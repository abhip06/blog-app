import { NextFunction, Request, Response } from "express";
import { ControllerType, UserAuthInfoRequest } from "../types/customTypes";

export const asyncHandler = (requestHandler: ControllerType) => {
    return (req: UserAuthInfoRequest | Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}