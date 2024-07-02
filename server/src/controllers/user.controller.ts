import { CookieOptions, NextFunction, Request, Response } from "express";

import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinaryService";

import { User } from "../models/user.models";
import { UserAuthInfoRequest, UserInfoType } from "../types/customTypes";
import mongoose from "mongoose";

// Global declarations
const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: false
}

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId);

        if (!user) throw new ApiError(404, "Invalid UserID. Could'nt generate Access and Refresh Token.");

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token.");
    }
};

const register = asyncHandler(async (req: Request<{}, {}, UserInfoType>, res: Response, next: NextFunction) => {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
        return next(new ApiError(400, "Please provide all fields"));
    }

    const userNameTaken = await User.findOne({ username });
    if (userNameTaken) return next(new ApiError(409, "Username already taken. Choose other username."));

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        // throw new ApiError(409, "You already have an account. Please login.");
        return next(new ApiError(409, "You already have an account. Please login."));
    }

    let avatar;
    let avatarLocalPath: string | undefined = req?.file?.path;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) return next(new ApiError(403, "Error while uploading avatar on cloudinary."));
    }

    const user = await User.create({
        username,
        fullName,
        email,
        avatar: avatar?.url || "",
        password
    });

    const createdUser = await User.findById(user._id).select("-email -password -refreshToken");

    if (!createdUser) {
        return next(new ApiError(500, "Something went wrong while registering the user."));
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "You have successfully registered.")
        );
});

const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!email && !username) {
        return next(new ApiError(400, "Please provide your Email or Username."));
    }

    if (!password) return next(new ApiError(400, "Password is required field."))

    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (!user) return next(new ApiError(400, "Incorrect email or password"));

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return next(new ApiError(400, "Incorrect email or password"));

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    refreshToken
                },
                // loggedInUser,
                "User Logged In successfully."
            )
        );
});

const logout = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully.")
        );
});

const getCurrentUser = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {

    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: req.user }, "User data fetched successfully.")
        );
});

const changeCurrentPassword = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    // if (!user) throw new ApiError(404, "User Not Found.");
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password");
    }

    user!.password = newPassword;
    await user?.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully."));
});

const updateAccountDetails = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) return next(new ApiError(400, "All fields are required."));

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully."));
});

const changeUserAvatar = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) return next(new ApiError(400, "Avatar file is missing."));

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) return next(new ApiError(403, "Error while uploading avatar on cloudinary."));

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully."));
});

const getUserById = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user: UserInfoType = await User.findById(req.params?.userId).select("-email -password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User data fetched successfully.")
        );
});

const searchUser = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const { fullName, username } = req.query;

    const users = await User.find(
        {
            $or: [
                { fullName }, { username }
            ]
        }
    ).select("-email -password -refreshToken");

    // let queryString = req.query.queryString;
    // let fullName, username;
    // if(!queryString) return next(new ApiError(400, "Bad request"));

    // if(queryString.slice(0,1) === "@"){
    //     username = queryString.slice(1);
    // } else{
    //     fullName = queryString;
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "User data fetched successfully.")
        );
});

const getBlogsPublished = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user: UserInfoType[] = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req?.user?._id)
            }
        },
        {
            $lookup: {
                from: "blogs",
                localField: "blogsPublished",
                foreignField: "_id",
                as: "blogsPublished",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "publisher",
                            foreignField: "_id",
                            as: "publisher",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        email: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$publisher"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].blogsPublished,
                "Published Blogs fetched successfully"
            )
        );
});

// Only admins can access
const getAllUsers = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) return next(new ApiError(401, "You Don't have permission to access these resources"));

    const users: UserInfoType[] = await User.find().select("-email -password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "All users fetched successfully.")
        );
});

// Only admins can access
const deleteUser = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) return next(new ApiError(401, "You Don't have permission to access these resources"));

    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) return next(new ApiError(400, "User not found. Please provide valid user Id."));

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User deleted successfully.")
        );
});

// Only admins can access
const modifyRoleOfUser = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) return next(new ApiError(401, "You Don't have permission to access these resources"));

    const user = await User.findById(req.params.userId).select("-email -password -refreshToken");

    if (!user) return next(new ApiError(400, "User not found. Please provide valid user Id."));

    if (Number(req.query.isAdmin) === 0) {
        user.isAdmin = false;
    } else {
        user.isAdmin = true;
    }

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Role updated successfully.")
        );
})

export {
    register,
    login,
    logout,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    changeUserAvatar,
    getUserById,
    searchUser,
    getAllUsers,
    getBlogsPublished,
    deleteUser,
    modifyRoleOfUser,
}