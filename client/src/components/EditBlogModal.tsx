import { useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import { BlogDataType } from "../types/types";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLoader from "./MainLoader";

type EditProfileType = {
    blogId: string;
    editBlogModal?: boolean;
    setEditBlogModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditBlogModal = ({ blogId, setEditBlogModal }: EditProfileType) => {

    const [loading, setLoading] = useState(false);
    const [blogImgURL, setBlogImgURL] = useState<File | any>();
    const [blogData, setBlogData] = useState<BlogDataType>();

    const navigate = useNavigate();

    const imageRef = useRef<HTMLInputElement | null>(null);

    const authStatus: boolean = useSelector((state: any) => state.auth.status);
    // const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<BlogDataType>({
        // defaultValues: {
        //     title: blogData?.title,
        //     content: blogData?.content,
        //     // blogImage: blogData?.blogImage,
        //     category: blogData?.category
        // }
        defaultValues: async () => {
            const response: any = await axios.get(`/api/v1/blogs/${blogId}`);

            if (response.data?.statusCode === 200) {
                setBlogData(response?.data.data);
                return response?.data?.data;
            }
        }
    });


    const handleImageChange = (e: any) => {
        setBlogImgURL(URL.createObjectURL(e.target?.files[0]!));
    }

    const formData = new FormData();
    // Save Modified content
    const updateBlog = async (data: BlogDataType) => {
        let isConfirmed = confirm("Are you sure you want to Modify the Blog?");
        if (isConfirmed) {
            try {
                clearErrors();
                setLoading(true);

                const file = imageRef?.current?.files?.[0];

                formData.append("blogImage", file!);
                formData.append("title", data?.title!);
                formData.append("content", data?.content!);
                formData.append("category", data.category!);

                console.log(formData);
                const response = await axios.patch(
                    `/api/v1/blogs/update-blog/${blogId}`,
                    // JSON.stringify(formData),
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true,
                    }
                );

                if (response?.data?.statusCode === 200) {
                    alert(response?.data?.message);
                    setEditBlogModal(false);
                    navigate(`/blog/${blogId}`);
                    window.location.reload();
                }
            } catch (error: any) {
                setError("root.serverError", {
                    type: "server-error",
                    message: error.response?.data?.message || "Something went wrong"
                });
                console.log(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    // useEffect(() => {
    //     fetchBlogInfo();
    // }), [];


    return authStatus && !loading ? (
        <div
            className="fixed h-full w-screen bg-black/50 backdrop-blur-sm top-0 left-0 transition-all">
            <section
                className="text-gray-800 bg-white overflow-y-auto flex-col rounded-lg absolute sm:left-1/4 left-4 top-8 h-full py-8 pb-20 sm:px-10 px-5 gap-10 z-50 sm:w-3/5 w-11/12 flex">
                <span
                    className="mt-0 mb-8 text-4xl font-bold text-gray-800 cursor-pointer"
                    onClick={() => setEditBlogModal(false)}
                >
                    {<IoMdClose />}
                </span>
                <form
                    onSubmit={handleSubmit(updateBlog)}
                    className="flex flex-col gap-9"
                    encType="multipart/form-data"
                >
                    <h1 className="text-3xl text-gray-800">Edit Blog</h1>
                    {errors.root?.serverError &&
                        (<span
                            className="text-red-500 text-sm"
                        >
                            {errors.root?.serverError?.message}.
                        </span>
                        )}


                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Blog Title</label>
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
                                required: { value: true, message: "Blog Title is required field" },
                                // pattern: { value: /^[A-Za-z]+$/i, message: "You can enter alphabets only" },
                            })}
                            className={`text-md border-2 ${errors.title ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Change blog Title?"

                        />
                    </div>

                    <div className="flex flex-col gap-10 border border-green-500 rounded-lg p-4">
                        <label className="text-sm text-green-600">Upload image <span className="text-red-500">*</span></label>
                        {errors.blogImage &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.blogImage?.message}.
                            </span>
                            )}

                        {blogImgURL ? (
                            <div
                                className="flex justify-center items-center rounded-lg w-full md:px-20 sm:px-16 px-5"
                            >
                                <img src={blogImgURL} alt="" className="w-full rounded-lg" />
                            </div>
                        ) : (
                            <div
                                className="flex justify-center items-center rounded-lg w-full md:px-20 sm:px-16 px-5"
                            >
                                <img src={blogData?.blogImage} alt="" className="w-full rounded-lg" />
                            </div>
                        )

                        }

                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            name="blogImage"
                            ref={imageRef}
                            className={`text-md border-2 bg-green-100 rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Blog Content</label>
                        {errors.content &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.content?.message}.
                            </span>
                            )}
                        <textarea
                            rows={16}
                            {...register("content", {
                                required: { value: true, message: "Blog Content is required field" },
                            })}
                            className={`text-md border-2 overflow-y-scroll ${errors.content ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Change blog Content?"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-green-600">Blog Category</label>
                        {errors.category &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.category?.message}.
                            </span>
                            )}
                        <input
                            type="text"
                            {...register("category", {
                                required: { value: true, message: "Blog Category is required field" },
                            })}
                            className={`text-md border-2 ${errors.category ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                            placeholder="Change blog Category?"
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="sm:w-1/3 w-full px-3 py-2 text-lg border border-green-500 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 disabled:bg-white disabled:text-green-500"
                    >
                        {loading ? <Spinner /> : "Save Changes"}
                    </button>
                </form>
            </section>
        </div>
    ) : (
        <MainLoader />
    )
}

export default EditBlogModal;