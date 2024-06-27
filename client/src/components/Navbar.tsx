// import axios from "axios";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
// import { logout } from "../features/authSlice";
import DropdownMenu from "./DropdownMenu";
import { UserInfoType } from "../types/types";
import SearchInput from "./SearchInput";
import axios from "axios";
import { logout } from "../features/authSlice";

// React icons
import { FaSearch } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { RiMenu3Line } from "react-icons/ri";

const Navbar = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const menuRef = useRef();
    const authStatus = useSelector((state: any) => state.auth.status)

    const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);


    // const closeDropdownMenu = (e: Event) => {
    //     if (!menuRef?.current?.contains(e.target)) {
    //         setOpen(false)
    //     }
    // }

    // useEffect((e: Event)=>{
    //     if(e.target !== null){
    //         setOpen(false)
    //     }
    // }, [open])

    let navListItems = [
        {
            label: "My Profile",
            linkUrl: "/my-profile",
            toShow: authStatus
        },
        {
            label: "All Blogs",
            linkUrl: "/blogs",
            toShow: true
        },
        {
            label: "Admin Dashboard",
            linkUrl: "/admin/dashboard",
            toShow: authStatus && userData?.isAdmin
        },
        {
            label: "Publish Blog",
            linkUrl: "/publish-blog",
            toShow: authStatus
        },
        {
            label: "About",
            linkUrl: "/about",
            toShow: true
        }
    ];

    // Logout user
    const handleOnClick = async () => {
        try {
            setLoading(true)
            const response: any = await axios.post(
                "/api/v1/users/logout",
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data?.success === true) {
                // console.log(response.data)
                setIsMenuOpen(false);
                dispatch(logout());
                navigate("/sign-in");
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <div className="sticky top-0 left-0 backdrop-blur-md bg-white/30 w-full flex flex-wrap justify-between items-center sm:px-16 px-5 py-4">
                <NavLink to="/">
                    <div className="flex font-bold text-2xl gap-2">
                        <span
                        className="text-gray-800"
                        >
                            Blog
                        </span>
                        <h3
                        className="text-green-500"
                        >
                            District
                        </h3>
                    </div>
                </NavLink>
                {/* <ul className={`flex sm:block items-center gap-7 text-gray-800`}> */}

                {
                    showSearchInput && <SearchInput />
                }

                {/* Desktop view */}
                {
                    !showSearchInput && (
                        <div className="md:block hidden">
                            <ul className="flex justify-center items-center gap-7 text-gray-800">
                                <NavLink
                                    to="/blogs"
                                    className={({ isActive }) => `text-md cursor-pointer hover:text-green-500 ${isActive ? "text-green-500" : "text-gray-800"}`}
                                >Blogs
                                </NavLink>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) => `text-md cursor-pointer hover:text-green-500 ${isActive ? "text-green-500" : "text-gray-800"}`}
                                >About
                                </NavLink>
                            </ul>
                        </div>
                    )
                }



                {/* Desktop view */}
                <div className="md:block hidden">
                    <div className="flex gap-4">

                        <button
                            onClick={() => setShowSearchInput(!showSearchInput)}
                            className="border-none text-gray-800 text-xl">
                            {showSearchInput ? <IoMdClose className="text-3xl font-bold" /> : <FaSearch />}
                        </button>

                        {

                            authStatus ? (
                                <div className="flex flex-col">
                                    <div
                                        onClick={() => setOpen(!open)}
                                        // ref={menuRef}
                                        className="flex justify-center items-center w-10 h-10 border-2 rounded-full cursor-pointer shadow-lg hover:shadow-sm hover:shadow-green-500"
                                    >
                                        <span
                                            className="flex justify-center items-center text-sm bg-green-500 text-white w-8 h-8  font-bold p-3 rounded-full"
                                        >
                                            {userData?.fullName[0]}
                                        </span>
                                    </div>
                                    <DropdownMenu isOpen={open} setOpen={setOpen} />
                                </div>
                            ) :
                                <div className="flex gap-4 text-sm">
                                    <NavLink
                                        to="/sign-in"
                                    >
                                        <button
                                            className="px-3 py-2 bg-green-500 text-white border rounded-lg cursor-pointer hover:bg-white hover:text-green-500 hover:border-green-500"
                                        >
                                            Sign In
                                        </button>
                                    </NavLink>

                                    <NavLink
                                        to="/sign-up"
                                    >
                                        <button
                                            className="px-3 py-2 border border-gray-800 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-800 hover:text-white"
                                        >
                                            Sign Up
                                        </button>
                                    </NavLink>
                                </div>

                        }
                    </div>
                </div>

                <div className="md:hidden block">
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => setShowSearchInput(!showSearchInput)}
                            className="border-none text-lg"
                        >
                            {showSearchInput ? <IoMdClose className="text-2xl" /> : <FaSearch />}
                        </button>

                        {
                            !showSearchInput && (
                                <RiMenu3Line
                                    className="text-2xl font-bolder cursor-pointer"
                                    onClick={() => setIsMenuOpen(true)}
                                />
                            )
                        }

                    </div>

                </div>

                {/* For mobile & Tablet view */}
                {
                    isMenuOpen && (
                        <div className="fixed h-screen w-screen md:hidden bg-black/50 backdrop-blur-sm top-0 left-0 transition-all">
                            <section className="text-black bg-white flex-col absolute right-0 top-0 h-screen w-64 p-8 gap-8 z-50 flex">
                                <span
                                    className="mt-0 mb-8 text-3xl text-gray-800 cursor-pointer"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {<IoMdClose />}
                                </span>
                                <div className="flex flex-col gap-7">
                                    {
                                        navListItems?.map((item, index) => (
                                            item.toShow && (
                                                <NavLink
                                                    to={item.linkUrl}
                                                    key={index}
                                                    className={({ isActive }) => `text-md cursor-pointer hover:text-green-500 ${isActive ? "text-green-500" : "text-gray-800"}`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >{item.label}
                                                </NavLink>
                                            )
                                        ))
                                    }
                                </div>
                                {
                                    authStatus ? (
                                        <button
                                            disabled={loading}
                                            onClick={handleOnClick}
                                            className="flex justify-center items-center gap-3 text-sm py-3 w-full rounded-lg cursor-pointer bg-gray-800 text-white border-2 hover:bg-white hover:text-gray-800"
                                        >
                                            Sign Out {<FiLogOut className="text-lg" />}
                                        </button>
                                    ) :
                                        <div className="flex gap-2 w-full">
                                            <NavLink
                                                to="/sign-in"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <button
                                                    className="text-sm px-3 py-2 bg-green-500 text-white border rounded-lg cursor-pointer hover:bg-white hover:text-green-500 hover:border-green-500"
                                                >
                                                    Sign In
                                                </button>
                                            </NavLink>

                                            <NavLink
                                                to="/sign-up"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <button
                                                    className="text-sm px-3 py-2 border border-gray-800 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-800 hover:text-white"
                                                >
                                                    Sign Up
                                                </button>
                                            </NavLink>
                                        </div>
                                }
                            </section>
                        </div>
                    )
                }

            </div>

        </>
    )
}

export default Navbar