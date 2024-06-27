import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery, unsetSearchQuery } from "../features/searchSlice";
// import SearchResults from "../pages/SearchResults";

// import { FaSearch } from "react-icons/fa";

const SearchInput = () => {

    const [inputData, setInputData] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleSearch() {
        if (inputData.length > 2) {
            dispatch(setSearchQuery(inputData))
            navigate(`/blog/search?query=${inputData}`)
        } else {
            dispatch(unsetSearchQuery())
        }
    }

    const handleEnterKey = (e: any) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    return (
        // <div className="fixed top-16 md:px-64 sm:px-28 px-5 inset-0 backdrop-blur-lg bg-opacity-50 bg-black flex justify-center items-start ease-in-out pt-20">
        // </div>
        <div className="sm:mt-0 mt-5 flex sm:w-3/5 w-11/12 justify-center items-center text-xs bg-white py-1 relative rounded-lg border-2 border-green-500" >
            <input
                onChange={(e) => setInputData(e.target.value)}
                onKeyDown={handleEnterKey}
                type="search"
                className="w-full overflow-hidden outline-none text-gray-700 sm:text-base text-sm px-4 py-1"
                placeholder="Type here to search"
            />
            <button
                type="submit"
                onClick={handleSearch}
                className="px-3 text-xs text-white bg-gray-800 border-none rounded-lg absolute top-0 right-0 h-full"
            >
                Search
            </button>
        </div>
    )
}

export default SearchInput