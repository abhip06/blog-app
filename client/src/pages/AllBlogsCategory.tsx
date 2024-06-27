import { NavLink, useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";
import MainLoader from "../components/MainLoader";
import { BlogDataType } from "../types/types";
import { useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import axios from "axios";

const AllBlogsCategory = () => {

    let { category } = useParams();

    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState<BlogDataType[] | null>(null);

    // const blogs: BlogDataType[] | null[] = useSelector((state: any) => state.blogs?.blogData);

    const fetchBlogsDataByCategory = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`/api/v1/blogs/category/${category}`);

            if (response?.data?.statusCode === 200) {
                setBlogs(response?.data?.data);
            }
        } catch (error: any) {
            console.log(error);
            console.log(error?.response?.message);
        } finally {
            setLoading(false);
        }
    }

    // Pagination Logic
    const postsPerPage = 8;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    let totalPosts: number = blogs ? blogs.length : 0;
    const currentPosts: BlogDataType[] | null[] = blogs ? blogs.slice(firstPostIndex, lastPostIndex) : [];

    const capitalizeFirst = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        fetchBlogsDataByCategory();
    }, []);

    return !loading ? (

        <div className="sm:px-16 px-5 py-9 min-h-[800px] justify-center items-center">
            <h1 className="md:text-4xl sm:text-2xl text-xl py-5 text-gray-700">Explore all Blog Posts for {capitalizeFirst(category!)}</h1>
            <div className="h-[1px] bg-gray-500"></div>

            {
                blogs && currentPosts.length > 0 ? (
                    <>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 md:gap-7 gap-4 py-12">
                            {
                                currentPosts?.map((blog) => (
                                    <NavLink to={`/blog/${blog?._id}`} key={blog?._id} >
                                        <BlogCard title={blog?.title} publisher={blog?.publisher} date={blog?.createdAt} blogImg={blog?.blogImage} />
                                    </NavLink>
                                ))
                            }
                        </div>

                        {/* Pagination section */}
                        <Pagination
                            totalPosts={totalPosts}
                            postsPerPage={postsPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        />

                    </>
                ) : (
                    <div className="text-2xl text-center">
                        <h1 className="text-2xl">Nothing to show</h1>
                    </div>
                )
            }
        </div>

    ) : (
        <MainLoader />
    )
}

export default AllBlogsCategory