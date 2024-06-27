
const MainLoader = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-5 text-green-500 h-[700px]">
            <div
                className="inline-block h-36 w-36 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
            <span className="text-2xl">Loading...</span>
            {/* <span className="text-2xl">Please Wait.</span> */}
        </div>
    )
}

export default MainLoader