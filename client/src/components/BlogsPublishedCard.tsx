import axios from "../Api";
import { useNavigate } from "react-router-dom";


type PublishedBlogsPropType = {
    blogId: string;
    title: string;
    blogImage: string;
    createdAt: string;
}

const BlogsPublishedCard = ({ blogId, title, blogImage, createdAt }: PublishedBlogsPropType) => {
    const navigate = useNavigate();

    const haandleDeleteBlog = async () => {
        let confirmation = confirm("Are you sure you want to delete the Blog?");
        if (confirmation) {
            try {
                const response = await axios.delete(
                    `/api/v1/blogs/delete/${blogId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            withCredentials: true
                        }
                    }
                );

                if (response?.data?.statusCode === 200) {
                    alert(response?.data?.message);
                    navigate("/my-profile");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="rounded-lg flex justify-between items-center p-3 border border-gray-400 hover:shadow-lg">
            <img
                src={blogImage}
                alt=""
                width={30}
                className="rounded-lg w-28"
            />
            <h1 className="text-lg">{title}</h1>
            <span className="text-sm">{createdAt}</span>
            <div className="flex gap-4">
                <button
                    className="p-3 text-xs border-none rounded-lg bg-blue-500 text-white"
                >
                    Edit
                </button>
                <button
                    className="p-3 text-xs border-none rounded-lg bg-red-500 text-white"
                    onClick={haandleDeleteBlog}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default BlogsPublishedCard