import { useSelector } from 'react-redux'
import { BlogDataType, UserInfoType } from '../types/types'
import heroImg from "../assets/heroImg.jpg";
import { changeDateFormat } from '../utils/dateFormat';
import axios from '../Api';
import { useEffect, useState } from 'react';
import MainLoader from '../components/MainLoader';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import EditBlogModal from '../components/EditBlogModal';

import { MdModeEdit, MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";

const Profile = () => {
    // const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [blogsData, setBlogsData] = useState<BlogDataType[]>([]);
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [editBlogModal, setEditBlogModal] = useState<boolean>(false);
    const [currentBlogId, setCurrentBlogId] = useState<string>("");

    const navigate = useNavigate();

    const userData: UserInfoType | null = useSelector((state: any) => state.auth?.userData?.data?.user);
    // const blogs: BlogDataType[] = useSelector((state: any) => state.blogs?.blogData);

    const fetchBlogsPublishedData = async (userId: string) => {
        try {
            setLoading(true);
            let response: any = await axios.get(
                `/api/v1/blogs/blog-publisher/${userId}`,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response?.data?.statusCode === 200) {
                setBlogsData(response?.data?.data);
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Delete Blog
    const haandleDeleteBlog = async (blogId: string) => {
        let confirmation = confirm("Are you sure you want to delete the Blog?");
        if (confirmation) {
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

    // Handle Edit Blog
    const handleEditBlog = (blogId: string) => {
        setCurrentBlogId(blogId);
        setEditBlogModal(true);
    }

    let convertedDate = changeDateFormat(userData!.createdAt.toString());

    useEffect(() => {
        fetchBlogsPublishedData(userData?._id!);
    }, []);

    return !loading ?
        <div className="sm:px-16 px-5 py-12 flex flex-col gap-5 min-h-[700px]">
            {/* <h1 className="sm:text-4xl text-2xl mb-10 text-center">PROFILE PAGE</h1> */}
            {
                editProfile && <EditProfileModal setEditProfile={setEditProfile} />
            }
            {
                editBlogModal && <EditBlogModal blogId={currentBlogId}  setEditBlogModal={setEditBlogModal} />
            }
            <div className="flex justify-between items-start py-3">
                <div className="flex sm:flex-row flex-col gap-10 justify-start items-start">
                    <div className="w-56 h-56">
                        {/* <div className="w-full h-full rounded-full bg-green-500"></div> */}
                        {
                            userData?.avatar ? (
                                <img
                                    src={heroImg}
                                    alt=""
                                    width={300}
                                    height={300}
                                    className="w-56 h-56 rounded-full z-50"
                                />
                            ) : (
                                <RxAvatar className="w-full h-full" />
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-4 justify-center">
                        <h2 className="text-4xl text-gray-800">{userData?.fullName.toUpperCase()}</h2>
                        <span className="text-base text-gray-500">@{userData?.username}</span>
                        <span className="text-base text-gray-500">{userData?.email}</span>
                        <span className="text-base text-gray-500">Joined on {convertedDate}</span>
                    </div>
                </div>
                <span
                    className="flex gap-1 justify-center items-center sm:text-sm text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() => setEditProfile(true)}
                >
                    {<MdModeEdit className="sm:text-lg text-base" />} Edit Profile
                </span>
            </div>
            <div className="w-full h-[1px] bg-gray-600"></div>
            <div className="flex flex-col gap-5">
                <h2 className="text-lg text-gray-800">Blogs Published</h2>

                <div className="overflow-x-auto rounded-lg">
                    <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Blog Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Published On
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            blogsData && blogsData?.map((blog: BlogDataType) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={blog._id}>
                                    <td className="px-6 py-4">
                                        <img src={blog?.blogImage} alt="" className="min-w-16 rounded-lg" width={80} />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {blog?.title.length > 55 ? blog?.title.slice(0, 55) + "..." : blog.title}
                                    </th>
                                    <td className="px-6 py-4">
                                        {blog?.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {changeDateFormat(blog!.createdAt!.toString())}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-xl">
                                            <button
                                                className="cursor-pointer p-2 border-none rounded-lg bg-green-500 text-white"
                                                onClick={() => navigate(`/blog/${blog?._id}`)}
                                            >
                                                {<BiSolidShow />}
                                            </button>
                                            <button
                                                className="cursor-pointer p-2 border-none rounded-lg bg-blue-500 text-white"
                                                // onClick={() => navigate(`/blog/${blog?._id}`)}
                                                onClick={() => handleEditBlog(blog?._id!)}
                                            >
                                                {<MdModeEdit />}
                                            </button>
                                            <button
                                                className="cursor-pointer p-2 border-none rounded-lg bg-red-500 text-white"
                                                onClick={() => haandleDeleteBlog(blog?._id!)}
                                            >
                                                {<MdDelete />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                {/* <div className="flex flex-col justify-center items-start gap-7">
                    {
                        blogsData?.map((blog) => (
                            <NavLink to={`/blog/${blog?._id}`} key={blog?._id} className="w-full">
                                <BlogsPublishedCard
                                    blogId={blog?._id!}
                                    title={blog?.title}
                                    blogImage={blog?.blogImage}
                                    createdAt={convertedDate}
                                />
                            </NavLink>
                        ))
                    }
                </div> */}

            </div>
        </div> : (
            <MainLoader />
        )

}

export default Profile;