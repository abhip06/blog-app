import { useSelector } from "react-redux";
import { BlogDataType } from "../types/types";
import { NavLink, useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";

interface BlogsCategoryProps {
    title: string;
}

const BlogsCategory = ({ title }: BlogsCategoryProps) => {

    const navigate = useNavigate();

    const blogs: BlogDataType[] = useSelector((state: any) => state.blogs?.blogData);

    function filterByCategory(category: string) {
        return blogs?.filter((blog) => {
            return blog.category === category
        }).slice(0, 4)
    }

    return (
        <div className="flex flex-col text-gray-800 my-20">
            <div className="flex justify-between items-center">
                <h2 className="sm:text-3xl text-xl">Top on {title}</h2>
                <span
                    className="sm:text-lg text-xs text-gray-700 cursor-pointer hover:text-gray-500"
                    onClick={()=> navigate(`/blog/c/${title?.toLowerCase()}`)}
                >
                    View More
                </span>
            </div>
            <div className="w-full bg-gray-500 h-[1px] my-4 mb-10"></div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-5">
                {
                    blogs && filterByCategory(title.toLowerCase())?.map((blog) => (
                        <NavLink to={`/blog/${blog?._id}`} key={blog?._id} >
                            <BlogCard title={blog.title} blogImg={blog.blogImage} date={blog.updatedAt} />
                        </NavLink>
                    ))
                }
            </div>
        </div>
    )
}

export default BlogsCategory