import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinaryService";

import { User } from "../models/user.models";
import { UserInfoType } from "../types/customTypes";

const register = asyncHandler(async (req: Request<{}, {}, UserInfoType>, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new ApiError(400, "Please provide all fields"));
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        return next(new ApiError(409, "You already have an account. Please login."));
    }

    let avatar;
    let avatarLocalPath: string | undefined = req?.file?.path;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if(!avatar) return next(new ApiError(403, "Error while uploading avatar on cloudinary."));
    }

    const user = await User.create({
        fullName,
        email,
        avatar: avatar?.url || "",
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        return next(new ApiError(500, "Something went wrong while registering the user."));
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "You have successfully registered.")
    );
});

export {
    register,
}