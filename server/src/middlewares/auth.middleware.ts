import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.models";
import { UserAuthInfoRequest } from "../types/customTypes";

interface IJwtPayload extends jwt.JwtPayload {
    _id: string;
}


export const verifyJWT = async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const token: string = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) return next(new ApiError(401, "Unauthorized Request."));

        const decodedToken = jwt.verify(token, process.env?.ACCESS_TOKEN_SECRET as Secret) as IJwtPayload;

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) return next(new ApiError(401, "Invalid Access Token."));

        req.user = user;

        next();

    } catch (error) {
        console.log("AUTH ERROR: ", error);
        return next(new ApiError(401, "Invalid Access Token."));
    }
}