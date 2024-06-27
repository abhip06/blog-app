import { NavLink } from "react-router-dom"

import { MdOutlineErrorOutline } from "react-icons/md";

const NotFound = () => {

    return (
        <div className="flex justify-center items-center h-[700px] sm:px-0 px-5">
            <div className="flex flex-col items-center gap-7 mx-auto my-auto text-gray-700">
                <div className="flex justify-center items-center gap-5 md:text-9xl sm:text-7xl text-5xl">
                    <MdOutlineErrorOutline />
                    <span>404</span>
                </div>
                <span className="md:text-2xl sm:text-xl text-base">Oops! The Page you are looking has Not Found.</span>
                <span
                    className="sm:text-base text-sm">Go to
                    <NavLink
                        to={"/"}
                        className="text-green-500 font-bold mx-2"
                    >
                        Home Page
                    </NavLink>
                    for more information.
                </span>
            </div>
        </div>
    )
}

export default NotFound;