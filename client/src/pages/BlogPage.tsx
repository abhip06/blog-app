import { useNavigate, useParams } from "react-router-dom";
import heroImg from "../assets/heroImg.jpg";
import axios from "../Api";
import { useEffect, useRef, useState } from "react";
import MainLoader from "../components/MainLoader";
import { BlogDataType, UserInfoType } from "../types/types";
import { useSelector } from "react-redux";
import { changeDateFormat } from "../utils/dateFormat";

import { MdModeEdit, MdDelete, MdSaveAlt } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import EditBlogModal from "../components/EditBlogModal";

const BlogPage = () => {

    let { blogId } = useParams();
    const [blogData, setBlogData] = useState<BlogDataType>();
    const [blogPublisher, setBlogPublisher] = useState<UserInfoType>();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editBlogModal, setEditBlogModal] = useState<boolean>(false);

    const navigate = useNavigate();

    // Ref declerations
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const contentRef = useRef<HTMLParagraphElement | null>(null);

    const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);

    const fetchBlogInfo = async () => {
        try {
            const response: any = await axios.get(`/api/v1/blogs/${blogId}`);

            if (response.data?.statusCode === 200) {
                setBlogData(response?.data.data);

                let publisher_info: any = await axios.get(`/api/v1/users/profile/${response?.data?.data?.publisher}`);

                if (publisher_info?.data?.statusCode === 200) {
                    setBlogPublisher(publisher_info?.data?.data);
                } else {
                    console.log(response?.data?.message);
                }
            }
            else {
                console.log(response?.data)
            }

        } catch (error: any) {
            console.log(error)
            // clearData();

        } finally {
            setLoading(false)
        }
    }

    // Save Modified content
    const handleSaveChanges = async () => {
        let isConfirmed = confirm("Are you sure you want to Modify the Blog?");
        if (isConfirmed) {
            try {
                setLoading(true);
                const formData = new FormData();

                const updatedTitle = titleRef?.current?.textContent;
                const updatedContent = contentRef?.current?.textContent;
                formData.append("title", updatedTitle!);
                formData.append("content", updatedContent!);
                // formData.append("category", data.category!);

                console.log(formData);
                const response = await axios.patch(
                    `/api/v1/blogs/update-blog/${blogId}`,
                    // JSON.stringify(formData),
                    formData,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (response?.data?.statusCode === 200) {
                    alert(response?.data?.message);
                    setIsEditing(false);
                    navigate(`/blog/${blogId}`);
                    window.location.reload();
                }
            } catch (error: any) {
                console.log(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    const haandleDeleteBlog = async () => {
        let isConfirmed = confirm("Are you sure you want to delete the Blog?");
        if (isConfirmed) {
            try {
                const response = await axios.delete(`/api/v1/blogs/delete/${blogId}`);

                if (response?.data?.statusCode === 200) {
                    alert(response?.data?.message);
                    navigate("/my-profile");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        fetchBlogInfo();
        // console.log(blogData)
    }, [])

    return !loading ? (
        <div className="flex flex-wrap flex-col justify-center items-start md:px-80 sm:px-32 px-7 sm:py-14 py-7 gap-5">
            {
                editBlogModal && <EditBlogModal blogId={blogId!} editBlogModal={editBlogModal} setEditBlogModal={setEditBlogModal} />
            }
            {
                blogData?.publisher === userData?._id &&
                (
                    <div className="flex gap-4">
                        {
                            isEditing ? (
                                <>
                                    <button
                                        className="flex justify-center items-center sm:gap-2 gap-1 px-3 py-2 sm:text-sm text-xs border border-gray-800 rounded-lg hover:text-gray-800 bg-gray-800 text-white hover:bg-white"
                                        onClick={handleSaveChanges}
                                    >
                                        <MdSaveAlt className="sm:text-xl text-base" /> Save Changes
                                    </button>
                                    <button
                                        className="flex justify-center items-center sm:gap-2 gap-1 px-3 py-2 sm:text-sm text-xs border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <IoMdClose className="sm:text-xl text-base" /> Cancel
                                    </button>
                                </>
                            ) : (

                                <>
                                    <button
                                        className="flex justify-center items-center sm:gap-2 gap-1 px-3 py-2 sm:text-sm text-xs border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white"
                                        // onClick={() => setIsEditing(!isEditing)}
                                        onClick={() => setEditBlogModal(true)}
                                    >
                                        <MdModeEdit className="sm:text-xl text-base" /> Edit
                                    </button>
                                    <button
                                        className="flex justify-center items-center sm:gap-2 gap-1 px-3 py-2 sm:text-sm text-xs border border-gray-800 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white"
                                        onClick={haandleDeleteBlog}
                                    >
                                        <MdDelete className="sm:text-xl text-base" /> Delete
                                    </button>

                                </>
                            )
                        }
                        <span className="sm:text-sm text-xs text-gray-500 text-center">Last Updated on ~ {changeDateFormat(blogData?.updatedAt!)}</span>
                    </div>
                )
            }
            <h1
                className={`${isEditing ? "py-3 px-2 border-2 border-green-500 rounded-lg bg-green-50 text-5xl" : ""} md:text-6xl sm:text-4xl text-3xl md:leading-tight leading-snug tracking-wide font-bold text-gray-800`}
                ref={titleRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
            >
                {blogData?.title}
            </h1>
            <div
                className="flex sm:justify-between justify-start sm:items-center items-start w-full sm:gap-0 gap-5 sm:my-5 my-2 flex-col sm:flex-row">
                <div className="flex justify-between items-center gap-3">
                    <img
                        src={heroImg} alt="Hero Image"
                        width={200}
                        height={200}
                        className="sm:w-14 w-10 sm:h-14 h-10 rounded-full"
                        contentEditable={isEditing}
                    />
                    <div
                        className="flex flex-col justify-center items-start">
                        <h3 className="text-gray-600 sm:text-base text-sm font-bold">{blogPublisher?.fullName}</h3>
                        <h3 className="text-gray-500 sm:text-sm text-xs">@{blogPublisher?.username}</h3>
                    </div>
                </div>
                <span className="sm:text-sm text-xs text-gray-500">Published on ~ {changeDateFormat(blogData?.createdAt!)}</span>
                {/* <span className="text-md text-gray-500">Published on ~ {blogData?.createdAt.slice(0,10)}</span> */}
            </div>
            <div className="w-full min-h-[1px] bg-gray-500 sm:mb-8 mb-2"></div>
            <div className="flex flex-col sm:gap-14 gap-8">
                <img
                    src={blogData?.blogImage}
                    alt="hero Img"
                    width={500}
                    height={500}
                    className="w-full rounded-lg max-h-[600px]"
                />
                <p
                    className={`${isEditing ? "py-3 px-2 border-2 border-green-500 rounded-lg bg-green-50" : ""} sm:text-lg text-justify whitespace-break-spaces sm:leading-9 leading-7 tracking-wide text-sm text-gray-800`}
                    ref={contentRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                >
                    {blogData?.content}
                </p>
            </div>
        </div>
    ) : (
        <MainLoader />
    )
}

export default BlogPage