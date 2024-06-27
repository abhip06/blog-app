import { useSelector } from "react-redux";
import TopBlogsCard from "../components/TopBlogsCard";
import { BlogDataType } from "../types/types";
import { NavLink } from "react-router-dom";
import { useRef } from "react";

import { FaArrowRightLong } from "react-icons/fa6";
import BlogsCategory from "../components/BlogsCategory";

let bgImg = "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Home = () => {

    const targetDivRef = useRef<HTMLDivElement | null>(null);

    const blogs: BlogDataType[] = useSelector((state: any) => state.blogs?.blogData);

    function filterByTopRated() {
        return blogs?.filter((blog) => {
            return blog.isTopRated;
        }).slice(0, 3)
    }

    return (
        <div>
            <div className="flex items-center md:min-h-[675px] min-h-[400px] gap-12 sm:px-10 md:px-16 px-6">
                <div className="flex flex-1 flex-col justify-center items-start gap-4">
                    <h2 className="md:text-8xl sm:text-6xl text-4xl text-white md:text-green-500 font-bold">Where Stories Bloom.</h2>
                    <span className="md:text-lg sm:text-sm text-xs text-white md:text-gray-800">A haven for passionate writers and curious readers to share their stories and embark on new adventures together.</span>

                    <div
                        className="cursor-pointer text-xs flex justify-center items-center sm:gap-3 gap-2 sm:text-base sm:mt-10 mt-3 sm:border-2 border border-white md:border-green-500 text-white md:text-green-500 md:hover:text-white md:hover:bg-green-500 hover:bg-white hover:text-gray-800  sm:px-5 sm:py-3 p-3 rounded-lg font-bold"
                        onClick={() => targetDivRef.current?.scrollIntoView({ behavior: "smooth" })}
                    >
                        Explore <FaArrowRightLong className="md:text-xl text-base" />
                    </div>
                </div>
                <div className="flex-1 justify-center items-end md:block hidden -z-50">
                    <img src={bgImg} alt="Hero Image" width={500} height={500} className="w-full brightness-75" />
                </div>
            </div>
            <img
                src={bgImg} alt="heroImg"
                width={500}
                className="md:hidden block h-2/3 absolute top-16 left-0 w-full bg-no-repeat bg-blend-darken brightness-50 -z-50" />
            <div
                ref={targetDivRef}
                className="w-full h-5"
            ></div>
            <div
                className="flex flex-col text-gray-800 my-10 bg-gradient-to-r from-cyan-50 to-green-100 sm:px-16 px-5 py-10 gap-10"

            >
                <h2 className="sm:text-3xl text-xl font-bold">Top Ranked Blogs</h2>
                {
                    blogs?.length !== 0 || blogs !== null ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-7">
                            {
                                blogs && filterByTopRated()?.map((blog) => (
                                    <NavLink to={`/blog/${blog?._id}`} key={blog?._id} >
                                        <TopBlogsCard title={blog?.title} content={blog?.content} blogImg={blog?.blogImage} date={blog?.updatedAt!} />
                                    </NavLink>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="w-full">
                            {
                                <h1 className="text-center sm:text-base text-sm">No Data Available</h1>
                            }
                        </div>
                    )
                }
            </div>

            <div className="sm:px-10 md:px-16 px-5">
                <BlogsCategory title="Technology" />
                <BlogsCategory title="Business" />
                <BlogsCategory title="Travelling" />
            </div>

        </div>
    )
}

export default Home;

{/* <div className="flex flex-col text-gray-800 my-10 mt-20">
    <div className="flex justify-between items-center">
        <h2 className="sm:text-3xl text-xl">Top on Business</h2>
        <span className="sm:text-lg text-xs text-gray-700 cursor-pointer hover:text-gray-500">View More</span>
    </div>
    <div className="w-full bg-gray-500 min-h-[1px] my-4 mb-8"></div>
    <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-5">
        {
            blogs && filterByCategory("business")?.map((blog) => (
                <NavLink to={`/blog/${blog?._id}`} key={blog?._id} >
                    <BlogCard title={blog.title} blogImg={blog.blogImage} date={blog.updatedAt} />
                </NavLink>
            ))
        }
    </div>
</div> */}