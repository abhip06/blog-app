import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { FiLogOut } from "react-icons/fi";
import { UserInfoType } from "../types/types";


type PropType = {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const DropdownMenu = ({ isOpen, setOpen }: PropType) => {
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);
    
    const menuItems = [
        {
            name: "My Profile",
            url: "/my-profile",
            toShow: true
        },
        {
            name: "Admin Dashboard",
            url: "/admin/dashboard",
            toShow: userData?.isAdmin
        },
        {
            name: "Publish Blog",
            url: "/publish-blog",
            toShow: true
        }
    ];

    const handleOnClick = async () => {
        try {
            setLoading(true)
            const response: any = await axios.post(
                "/api/v1/users/logout",
                {
                    withCredentials: true,
                }
            );

            if (response.data?.success === true) {
                dispatch(logout())
                setOpen(false);
                navigate("/sign-in")
            }
        } catch (error: any) {
            console.log(error.message);
            setOpen(false);
        } finally {
            setLoading(false)
        }
    }

    return isOpen && (
        <div className="flex flex-col gap-5 absolute p-5 w-56 bg-green-50 top-16 right-16 rounded-lg shadow-md border border-green-400 z-50">
            <ul className="flex flex-col justify-center items-start text-gray-800 gap-3">
                {
                    menuItems.map((list) => (
                        list.toShow && (
                            <NavLink
                            to={list.url}
                            key={list.name}
                            onClick={() => setOpen(false)}
                        >
                            <li
                                className="text-md cursor-pointer text-gray-700 hover:text-green-500"
                            >
                                {list.name}
                            </li>
                        </NavLink>
                        )
                    ))
                }
                {/* <NavLink to={"/my-profile"}>
                <li
                    // key={list}
                    className="text-md cursor-pointer text-gray-700 hover:text-green-500"
                >
                    Profile
                </li>
                </NavLink> */}
            </ul>
            <button
                disabled={loading}
                onClick={handleOnClick}
                className="flex justify-center items-center gap-3 py-3 mx-auto w-full rounded-lg text-sm cursor-pointer bg-gray-800 text-white border-2 hover:bg-white hover:text-gray-800"
            >
                {<FiLogOut className="text-lg" />} Sign Out
            </button>
        </div>
    )
}

export default DropdownMenu