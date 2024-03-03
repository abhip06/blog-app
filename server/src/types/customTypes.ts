import { NextFunction, Request, Response } from "express";

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Response<any, Record<string, any>> | void>

export type UserInfoType = {
    _id?: string;
    fullName: string;
    email: string;
    avatar?: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}