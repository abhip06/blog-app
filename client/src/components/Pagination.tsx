

interface PaginationPropType {
    totalPosts: number;
    postsPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }: PaginationPropType) => {

    const paginationNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        paginationNumbers.push(i);
    }


    return (
        <div className="flex justify-center items-center w-full py-10">
            <div className="flex gap-4">
                {
                    paginationNumbers?.map((page, index) => (
                        <button
                            className={`${page === currentPage ? "bg-green-500 text-white" : ""} sm:px-4 px-3 sm:py-3 py-2 border-2 border-green-500 bg-green-50 sm:text-xl text-base text-green-600 rounded-lg hover:bg-green-100`}
                            key={index}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Pagination