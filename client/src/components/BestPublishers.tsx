import heroImg from "../assets/heroImg.jpg";

const BestPublishers = () => {
    return (
        <div className="flex rounded-lg p-7 border justify-start items-center gap-7 bg-blue-100 hover:shadow-2xl min-w-[300px]">
            <img src={heroImg} alt="Hero Image" width={200} height={200} className="w-24 h-24 rounded-full" />
            <div className="flex flex-col justify-center items-start">
                <h3 className="text-2xl font-bold">Abhinav Patel</h3>
                <h3 className="text-md">@abhi01</h3>
                <span className="text-xl">Rated #1</span>
                <span className="text-sm text-gray-600 font-bold mt-5 cursor-pointer hover:text-gray-500">View All Blogs &rarr;</span>
            </div>
        </div>
    )
}

export default BestPublishers