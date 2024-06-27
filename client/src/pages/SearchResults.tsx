import { NavLink } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { BlogDataType } from "../types/types";
import { useSelector } from "react-redux";
import MainLoader from "../components/MainLoader";

type CustomError = {
  statusCode?: number;
  message?: string;
}

const SearchResults = () => {
  // let blogs: any[] = [];
  const [blogData, setBlogData] = useState<BlogDataType[]>([]);
  const [error, setError] = useState<CustomError>({});
  const [loading, setLoading] = useState(true);

  // let searched_query = new URLSearchParams(location.search).get("title");
  // let qnew = window.location.search.substring(1);
  const search_query = useSelector((state: any) => state.search?.searchQuery);

  let searchData = async () => {
    try {
      const response = await axios.get(`/api/v1/blogs/search?searchQuery=${search_query}`);

      if (response.data.statusCode === 200) {
        setBlogData(response.data?.data)
      } else {
        setError(response.data.message)
      }
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchData();      
  }, [search_query])

  return loading ? (
      <MainLoader />
  )
    : (
      <div className="flex flex-col sm:px-16 px-5 py-10 min-h-[700px]">
        <h2 className="md:text-3xl sm:text-2xl text-xl">{blogData.length} - Search Results found for {search_query}</h2>
        <div className="w-full my-10 h-[1px] bg-gray-500"></div>

        {
          blogData && blogData.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 md:gap-7 gap-4">
              {
                blogData?.map((blog) => (
                  <NavLink to={`/blog/${blog?._id}`} key={blog?._id} >
                    <BlogCard title={blog?.title} publisher={blog?.publisher} date={blog?.createdAt} blogImg={blog?.blogImage} />
                  </NavLink>
                ))
              }
            </div>
          ) : (
            <div className="text-2xl text-center">
              {error ? error?.message : "Nothing to Show."}
            </div>
          )
        }
      </div>
    )
}

export default SearchResults