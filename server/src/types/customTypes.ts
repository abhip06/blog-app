import { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";

export interface UserInfoType {
    _id?: string;
    username: string;
    fullName: string;
    email: string;
    avatar?: string;
    password: string;
    blogsPublished?: string[];
    isAdmin: boolean;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserAuthInfoRequest extends Request {
    user?: UserInfoType;

}

export type ControllerType = (
    req: UserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => Promise<Response<any, Record<string, any>> | void>

export interface BlogInfoType {
    _id?: string;
    title: string;
    content: string;
    blogImage: string;
    category: string;
    publisher: UserInfoType;
    createdAt: Date;
    updatedAt: Date;
}
