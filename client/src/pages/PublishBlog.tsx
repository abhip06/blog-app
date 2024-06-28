import { useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { BlogDataType } from "../types/types";
import Spinner from "../components/Spinner";
import axios from "../Api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublishBlog = () => {

    const [loading, setLoading] = useState(false);
    const [blogImgURL, setBlogImgURL] = useState<File | any>();
    const navigate = useNavigate();

    const publisher_id: string | null = useSelector((state: any) => state.auth.userData?.data?.user?._id);

    const imageRef = useRef<HTMLInputElement | null>(null);
    // const blogTitle = useRef<HTMLInputElement | null>(null);
    // const blogContent = useRef<HTMLTextAreaElement | null>(null);
    // const blogCategory = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<BlogDataType>()


    const handleImageChange = (e: any) => {
        setBlogImgURL(URL.createObjectURL(e.target?.files[0]!));
    }

    // const convertToBase64 = (file: File) => {
    //     return new Promise((resolve, reject) => {
    //         const fileReader = new FileReader();
    //         fileReader.readAsDataURL(file);
    //         fileReader.onload = () => {
    //             resolve(fileReader.result);
    //         };
    //         fileReader.onerror = (error) => {
    //             reject(error);
    //         };
    //     });
    // };

    const publishBlog = async (data: BlogDataType) => {

        clearErrors()
        setLoading(true)

        try {
            const formData = new FormData();
            const file = imageRef?.current?.files?.[0];
            
            formData.append("blogImage", file!);
            formData.append("title", data.title!);
            formData.append("content", data.content!);
            formData.append("category", data.category!);
            formData.append("publisher", publisher_id!);

            console.log(formData);

            const response: any = await axios.post(
                "/api/v1/blogs/publish",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                     },
                    withCredentials: true,
                }
            );

            if (response.data?.success === true) {
                navigate(`/blog/${response.data?.data?._id}`)
            }

        } catch (error: any) {
            setError("root.serverError", {
                type: "server-error",
                message: error.response?.data?.message || "Something went wrong"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 justify-center items-center w-full min-h-[650px] sm:px-56 px-6 py-16">
            <div className="flex flex-col gap-5 border-2 border-green-500 rounded-lg w-full px-4 py-7">
                <h2 className="text-3xl text-gray-800 mb-5 text-center">Publish new Blog</h2>
                {/* <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    encType="multipart/form-data"
                >
                    <div className="flex flex-col gap-10 border border-green-500 rounded-lg p-4">
                        <label className="text-sm text-green-600">Upload image <span className="text-red-500">*</span></label>

                        {blogImgURL && <div
                            className="flex justify-center items-center rounded-lg w-full md:px-20 sm:px-16 px-5"
                        >
                            <img src={blogImgURL} alt="" className="w-full rounded-lg" />
                        </div>}

                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            name="blogImage"
                            ref={imageRef}
                            className={`text-md border-2 bg-green-100 rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}

                            // onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className={`text-md border-2 rder-green-500 unded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Enter Blog title"
                            ref={blogTitle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Content <span className="text-red-500">*</span></label>
                        
                        <textarea
                            rows={12}
                            name="content"
                            className={`w-full text-md border-2 border-green-500 rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Enter content here"
                            ref={blogContent}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Category <span className="text-red-500">*</span></label>

                        <input
                            type="text"

                            className={`text-md border-2 border-green-500 rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Enter Category"
                            ref={blogCategory}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-40 w py-2 text-lg border border-green-500 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 disabled:bg-white disabled:text-green-500"
                    >
                        {loading ? <Spinner /> : "Publish"}
                    </button>
                </form> */}
                <form
                    onSubmit={handleSubmit(publishBlog)}
                    encType="multipart/form-data"
                    className="flex flex-col gap-5"
                >
                    {errors.root?.serverError &&
                        (<span
                            className="text-red-500 text-sm"
                        >
                            {errors.root?.serverError &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.root?.serverError?.message}
                                </span>
                                )}
                        </span>
                        )}

                    <div className="flex flex-col gap-10 border border-green-500 rounded-lg p-4">
                        <label className="text-sm text-green-600">Upload image <span className="text-red-500">*</span></label>
                        {errors.blogImage &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.blogImage?.message}.
                            </span>
                            )}

                        {blogImgURL && <div
                            className="flex justify-center items-center rounded-lg w-full md:px-20 sm:px-16 px-5"
                        >
                            <img src={blogImgURL} alt="" className="w-full rounded-lg" />
                        </div>}

                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            name="blogImage"
                            ref={imageRef}
                        // {...register("blogImage", {
                        //     required: { value: true, message: "Blog Image is required" },
                        // })}
                        className={`text-md border-2 bg-green-100 rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                        onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Title <span className="text-red-500">*</span></label>
                        {errors.title &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.title?.message}.
                            </span>
                            )}
                        <input
                            type="text"
                            {...register("title", {
                                required: { value: true, message: "Title is required field" },
                            })}
                            className={`text-md border-2 ${errors?.category? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Enter Blog title"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Content <span className="text-red-500">*</span></label>
                        {errors.content &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.content?.message}.
                            </span>
                            )}
                        <textarea
                            rows={18}
                            // type="content"
                            {...register("content", {
                                required: { value: true, message: "This is required field" },
                                // minLength: { value: 8, message: "Password should contain atleast 8 characters" }
                            })}
                            className={`w-full overflow-y-scroll list-item whitespace-break-spaces text-md border-2 ${errors.content ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            
                            placeholder="Enter content here"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Category <span className="text-red-500">*</span></label>
                        {errors.title &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.category?.message}.
                            </span>
                            )}
                        <input
                            type="text"
                            {...register("category", {
                                required: { value: true, message: "Category is required field" },
                            })}
                            className={`text-md border-2 ${errors?.category? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Enter Category"
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-40 w py-2 text-lg border border-green-500 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 disabled:bg-white disabled:text-green-500"
                    >
                        {loading ? <Spinner /> : "Publish"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PublishBlog