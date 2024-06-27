import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { UserInfoType } from "../types/customTypes";

interface UserModel extends UserInfoType, Document{
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

const userSchema = new mongoose.Schema<UserModel>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        avatar: {
            type: String,   // cloudinary url
        },
        password: {
            type: String,
            required: true,
            min: [8, "Password should contain atleast 8 characters"]
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// Converting Passwords into hash Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Checking the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

// Generating Access Token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Generating Refresh Token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model<UserModel>("User", userSchema);