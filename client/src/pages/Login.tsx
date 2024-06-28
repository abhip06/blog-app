import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../Api";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../features/authSlice";

import { PiSignInLight } from "react-icons/pi";
import { BiShow } from "react-icons/bi";
import { GrHide } from "react-icons/gr";

type LoginData = {
    email?: string;
    username?: string;
    password: string;
}


const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>()

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authStatus = useSelector((state: any) => state.auth.status);

    const loginUser = async (data: LoginData) => {
        try {

            clearErrors()
            setLoading(true)

            const response: any = await axios.post(
                "/api/v1/users/login",
                JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data?.success === true) {
                dispatch(login(response.data))
                navigate("/")
            }

        } catch (error: any) {
            dispatch(logout())
            setError("root.serverError", {
                type: "server-error",
                message: error.response?.data?.message || "Something went wrong"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authStatus) {
            navigate("/my-profile")
        }
    }, []);

    return !authStatus && (
        <div className="flex justify-center items-center w-full min-h-[650px] sm:px-auto px-6">
            <div className="flex flex-col gap-5 border-2 border-green-500 rounded-lg w-96 px-4 py-7">
                <h2
                    className="flex justify-center items-center gap-3 text-3xl text-gray-800 mb-5 text-center"
                >
                    {<PiSignInLight className="text-4xl font-bolder" />}
                    Sign In

                </h2>
                <div className="flex flex-col gap-10">
                    <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-5">

                        {errors.root?.serverError &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.root?.serverError?.message}.
                            </span>
                            )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Username <span className="text-red-500">*</span></label>
                            {errors.username &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.username?.message}.
                                </span>
                                )}
                            <input
                                type="text"
                                {...register("username", {
                                    required: { value: true, message: "Username is required field" },
                                })}
                                className={`text-md border-2 ${errors.username ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Password <span className="text-red-500">*</span></label>
                            {errors.password &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.password?.message}.
                                </span>
                                )}
                            <div className={`flex justify-between items-center text-md border-2 ${errors.password ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: { value: true, message: "Password is required field" },
                                        // minLength: { value: 8, message: "Password should contain atleast 8 characters" }
                                    })}
                                    // className={`text-md border-2 ${errors.password ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                    className="outline-none w-full  py-2 px-4"
                                    placeholder="Enter your password"
                                />
                                <span
                                    className="mr-4 cursor-pointer hover:bg-green-100 rounded-full p-1"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {
                                        showPassword ?
                                            <BiShow className="text-2xl" /> :
                                            <GrHide className="text-2xl" />
                                    }
                                </span>

                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-2 text-lg border border-green-500 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 disabled:bg-white disabled:text-green-500"
                            >
                                {loading ? <Spinner /> : "Sign In"}
                            </button>
                            <span
                                className="text-sm text-gray-800 cursor-pointer"
                                onClick={() => navigate("/sign-up")}
                            >
                                Don't have an account?
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login