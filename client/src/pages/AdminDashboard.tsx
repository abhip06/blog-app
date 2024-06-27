import { useSelector } from "react-redux";
import { BlogDataType, UserInfoType } from "../types/types";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardContent from "../components/DashboardContent";

import { MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import { changeDateFormat } from "../utils/dateFormat";


const AdminDashboard = () => {

    const [isActive, setIsActive] = useState(false);

    const navigate = useNavigate();

    // const authStatus = useSelector((state: any) => state.auth.status);
    const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);
    const blogsData: BlogDataType[] = useSelector((state: any) => state.blogs?.blogData);

    let navListItems = [
        {
            label: "Show All Blogs",
        },
        {
            label: "Show All Users",
        },
        {
            label: "Analytics",
        },
        {
            label: "Settings",
        }
    ];

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

    // useEffect(() => {
    //     if (!authStatus) {
    //         navigate("/sign-in");
    //     }
    //     if (authStatus && !userData?.isAdmin) {
    //         navigate("/my-profile");
    //     }
    // }), [authStatus, userData];

    // authStatus && userData?.isAdmin &&
    return (
        <div className="flex">
            {/* Side bar */}
            <section
                className="flex-1/2 md:block hidden text-black bg-white border-r border-gray-500 flex-col relative left-0 top-0 min-h-screen w-1/5 p-10 gap-8">


                <div className="flex flex-col gap-7">
                    <div className="flex items-start md:gap-3 gap-1 mb-7">
                        <h1 className="text-xl">Abhinav Patel</h1>
                        {/* <h1 className="text-4xl">{userData?.fullName?.toUpperCase()}</h1> */}
                        <div className="bg-green-100 px-2 py-1 rounded-lg text-xs">Admin</div>
                    </div>
                    {
                        navListItems?.map((item, index) => (
                            // <NavLink
                            //     to={item.linkUrl}
                            //     key={index}
                            //     className={({ isActive }) => `text-base cursor-pointer hover:text-green-500 ${isActive ? "text-green-500" : "text-gray-800"}`}
                            // >{item.label}
                            // </NavLink>
                            <span
                            key={index}
                            className={`text-base cursor-pointer hover:text-green-500 ${isActive ? "text-green-500" : "text-gray-800"}`}
                            onClick={()=> setIsActive(true)}
                            >
                                {item.label}
                            </span>
                        ))
                    }
                </div>
            </section>

            {/* Main Section */}
            <section className="flex-1 flex flex-col w-full md:px-16 sm:px-9 px-5 py-10 text-gray-700 ">
                {/* <h1 className="text-4xl">Show All Blogs</h1>
                <div className="w-full bg-gray-500 h-[1px] my-3 mb-10"></div> */}

                {/* Table */}
                {/* <div className="overflow-x-auto rounded-lg">
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
                </div> */}
                {isActive ? <DashboardContent title="All Blogs" /> : ""}
            </section>
        </div>
    )
}

export default AdminDashboard;