// import heroImg from "../assets/heroImg.jpg";
// import { BlogDataType } from "../types/types";
import { changeDateFormat } from "../utils/dateFormat";

const BlogCard = ({ title, blogImg, date }: any) => {

    let convertedDate = changeDateFormat(date);

    return (
        <div
            className="sm:h-[425px] h-[380px] flex flex-col gap-7 rounded-lg border-2 border-gray-300 justify-start cursor-pointer items-start hover:shadow-2xl">
            <img
                src={blogImg}
                alt="Hero Image"
                width={300}
                className="w-full sm:h-[200px] h-[185px] rounded-t-lg overflow-hidden"
            />
            <div className="flex flex-col gap-5 sm:p-4 p-3">
                <h3 className="md:text-2xl text-lg text-gray-800">{title.length > 50 ? title.slice(0, 50) + "..." : title}</h3>
                <span className="sm:text-sm text-xs text-gray-500 hover:text-gray-500">{convertedDate}</span>
                {/* <span className="text-sm text-gray-500 font-bold hover:text-gray-500">{date.slice(0,10)}</span> */}
            </div>
        </div>
    )
}

export default BlogCard