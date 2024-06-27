

const Spinner = () => {
    return (
        // <div>
        //     <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
        // </div>
        <div className="flex justify-center items-center gap-3 text-green-500">
            <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
            <span className="text-md">Processing</span>
        </div>
    )
}

export default Spinner