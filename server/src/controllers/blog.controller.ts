import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinaryService";
import { Blog } from "../models/blog.models";
import { ApiResponse } from "../utils/ApiResponse";
import { BlogInfoType, UserAuthInfoRequest } from "../types/customTypes";


export const publishBlog = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        return next(new ApiError(400, "Please provide all fields"));
    }

    // console.log(title, " ", content, " ", category)

    const blogImageLocalPath = req.file?.path;
    // console.log(req.file)
    // console.log(blogImageLocalPath)
    if (!blogImageLocalPath) return next(new ApiError(400, "Please provide Blog Image."));

    const blogImage = await uploadOnCloudinary(blogImageLocalPath);
    if (!blogImage) return next(new ApiError(403, "Error while uploading blog image on cloudinary."));

    const blogPost = await Blog.create({
        title,
        content,
        blogImage: blogImage?.url,
        category,
        publisher: req.user
    });

    return res
        .status(201)
        .json(
            new ApiResponse(200, blogPost, "Blog Published successfully.")
        );
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const { page } = req.query;
    // const resultPerPage = 8;

    // const currentPage: number = Number(page) || 1;

    // const skip: number = resultPerPage * (currentPage - 1);
    // const blogs: BlogInfoType[] = await Blog.find().limit(resultPerPage).skip(skip);

    const blogs: BlogInfoType[] = await Blog.find();

    if (!blogs) return next(new ApiError(500, "Could not fetch data."));

    let message = "";
    if (blogs.length === 0) {
        message = "No Blog available."
    } else {
        message = "All blogs fetched successfully."
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, blogs, message)
        );
});

export const getBlogById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { blogId } = req.params;
    if (!blogId) return next(new ApiError(400, "Blog Id not provided."));

    const blog: BlogInfoType | null = await Blog.findById({ _id: blogId });

    if (!blog) return next(new ApiError(404, "Could not fetch data based on your query."));

    return res
        .status(200)
        .json(
            new ApiResponse(200, blog, "Blog Info fetched successfully.")
        );
});

export const updateBlog = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {

    const { title, content, category } = req.body;
    const blogId = req.params?.blogId;

    console.log(title, " ", content, " ", category);
    console.log(blogId)

    if (!title || !content || !category) return next(new ApiError(400, "Please provide all fields."));

    const blogImageLocalPath = req.file?.path;
    if (!blogImageLocalPath) return next(new ApiError(400, "Please provide Blog Image."));

    const blogImage = await uploadOnCloudinary(blogImageLocalPath);
    if (!blogImage) return next(new ApiError(403, "Error while uploading blog image on cloudinary."));


    const blog: BlogInfoType | null = await Blog.findById(blogId);

    if (String(req.user?._id) !== String(blog?.publisher?._id)) return next(new ApiError(401, "You Don't have permission to access these resources."));

    // reqBlog!.title = title;
    // reqBlog!.content = content;
    // reqBlog!.blogImage = blogImage?.url;
    // reqBlog!.category = category;

    // await reqBlog.save();

    const updateBlog: BlogInfoType | null = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: {
                title,
                content,
                blogImage: blogImage?.url,
                category
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updateBlog, "Blog updated successfully.")
        );
});

export const updateBlogImage = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const blogId = req.params;

    const blogImageLocalPath = req.file?.path;
    if (!blogImageLocalPath) return next(new ApiError(400, "Please provide Blog Image."));

    const blogImage = await uploadOnCloudinary(blogImageLocalPath);
    if (!blogImage) return next(new ApiError(403, "Error while uploading blog image on cloudinary."));


    const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: {
                blogImage: blogImage?.url
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog Image updated successfully.")
        );
});

export const searchBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { searchQuery } = req.query;

    // if (typeof content !== "string") return next(new ApiError(400, "Provided query paarameter is not string."));
    if (!searchQuery) return next(new ApiError(400, "Please provide the query string."));

    let title = { $regex: searchQuery, $options: "i" };
    let category = { $regex: searchQuery, $options: "i" };

    const blogs = await Blog.find({
        $or: [{ title }, { category }]
    });

    let message: string = "";
    if (blogs.length === 0) {
        message = "No results found";
    } else {
        message = `${blogs.length} Results found based on searched query.`;
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blogs, message)
        );
});

export const blogPublisher = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { publisherId } = req.params;

    if (!publisherId) return next(new ApiError(400, "Publisher's ID not provided."));

    const blogs: BlogInfoType[] = await Blog.find().where({ publisher: publisherId });

    if (!blogs) return next(new ApiError(404, "Result not found."));

    let message: string = blogs.length < 1 ? "No post matches the call." : "All Blogs fetched successfully based on their publisher.";
    return res
        .status(200)
        .json(new ApiResponse(200, blogs, message));
});

export const deleteBlog = asyncHandler(async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    // if (!req.user?.isAdmin) return next(new ApiError(401, "You Don't have permission to access these resources"));

    const blog = await Blog.findByIdAndDelete(req.params?.blogId);

    if (!blog) return next(new ApiError(400, "Blog not found. Please provide valid Blog Id."));

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Blog deleted successfully.")
        );
});

export const getBlogsByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { category } = req.params;

    if (!category) return next(new ApiError(400, "Please provide query string."));

    const blogs: BlogInfoType[] = await Blog.find().where({ category });

    let message = "";
    if (blogs.length === 0 || blogs === null) {
        message = `No Blog Found for ${category}.`;
    } else {
        message = `All blogs fetched successfully for ${category}.`;
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, blogs, message)
        );
});