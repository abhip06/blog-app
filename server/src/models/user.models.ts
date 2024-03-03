import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserInfoType } from "../types/customTypes";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        avatar: {
            type: String,   // cloudinary url
        },
        password: {
            type: String,
            required: true,
            min: [8, "Password should contain atleast 8 characters"]
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// Converting Passwords into hash Password
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Checking the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model<UserInfoType>("User", userSchema);