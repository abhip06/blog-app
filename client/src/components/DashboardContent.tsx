import { useNavigate } from "react-router-dom";

import { MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";


import { changeDateFormat } from "../utils/dateFormat";
import axios from "axios";
import { useSelector } from "react-redux";
import { BlogDataType } from "../types/types";
import { useState } from "react";

interface PropTypes{
    title: string;
}

const DashboardContent = ({title}: PropTypes) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(title?.split(" "));

    const blogsData: BlogDataType[] = useSelector((state: any) => state.blogs?.blogData);

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
    
  return !loading && (
    <div>
        <h1 className="text-4xl">{title}</h1>
                <div className="w-full bg-gray-500 h-[1px] my-3 mb-10"></div>

                {/* Table */}
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
    </div>
  )
}

export default DashboardContent