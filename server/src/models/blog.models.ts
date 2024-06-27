import mongoose, { Schema } from "mongoose";
import { BlogInfoType } from "../types/customTypes";

// interface BlogModel extends BlogInfoType, Document{
// }

const blogSchema = new Schema(
    {
        title: {
            type: String,
            maxLength: 200,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        blogImage: {
            type: String,
            required: true
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        category: {
            type: String,
            required: true
        },
        isTopRated: {
            type: Boolean,
            default: false
        }
    }, {timestamps: true}
);

export const Blog = mongoose.model<BlogInfoType>("Blog", blogSchema);