
import { changeDateFormat } from "../utils/dateFormat";

interface TopRatedBlogsType {
    title: string;
    content: string;
    blogImg: string;
    date: string;
}

const TopBlogsCard = ({ title, content, blogImg, date }: TopRatedBlogsType) => {

    let convertedDate = changeDateFormat(date);

    return (
        <div className="flex flex-col gap-5 rounded-lg justify-center bg-white items-start hover:shadow-xl sm:min-h-[500px] min-h-[400px]">
            <img src={blogImg} alt="Hero Image" width={300} className="w-full rounded-t-lg overflow-hidden sm:h-[300px] h-[200px]" />
            <div className="flex flex-col gap-5 sm:p-5 p-3">
                <h3 className="sm:text-2xl text-xl font-bold">{title}</h3>
                <span className="sm:text-base text-sm">{content?.slice(0, 100)}...</span>
                <span className="sm:text-sm text-xs text-gray-500 hover:text-gray-500">{convertedDate}</span>
                <span className="sm:text-sm text-xs text-gray-500 font-bold sm:mt-2 mt-1 cursor-pointer hover:text-gray-500">View Blog &rarr;</span>

            </div>
        </div>
    )
}

export default TopBlogsCard