import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import axios from "../Api";


import { BiShow } from "react-icons/bi";
import { GrHide } from "react-icons/gr";
import { useSelector } from "react-redux";

type FormData = {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

// type ServerResponse = {
//     statusCode: number;
//     data?: FormData;
//     message: string;
//     success: boolean
// }

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const authStatus = useSelector((state: any) => state.auth.status);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<FormData>()

    const navigate = useNavigate();

    const registerUser = async (data: FormData) => {

        try {
            clearErrors()
            setLoading(true)

            const response: any = await axios.post(
                "/api/v1/users/register",
                JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data?.statusCode === 200) {
                console.log(response.data)
                navigate("/sign-in")
            }

        } catch (error: any) {
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
        <div className="flex justify-center items-center w-full min-h-[700px] sm:px-auto px-6">
            <div className="flex flex-col gap-5 border-2 border-green-500 rounded-lg w-96 px-4 py-7">
                <h2 className="text-3xl text-gray-800 mb-5 text-center">Sign Up</h2>
                <div className="flex flex-col gap-10">
                    <form onSubmit={handleSubmit(registerUser)} className="flex flex-col gap-5">

                        {errors.root?.serverError &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.root?.serverError?.message}.
                            </span>
                            )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Name <span className="text-red-500">*</span></label>
                            {errors.fullName &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.fullName?.message}.
                                </span>
                                )}

                            <input
                                type="text"
                                {...register("fullName", {
                                    required: { value: true, message: "Name is required field" },
                                })}
                                className={`text-md border-2 ${errors.fullName ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                placeholder="Enter your Full Name"
                            />

                        </div>

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
                                placeholder="Set your username"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Email <span className="text-red-500">*</span></label>
                            {errors.email &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.email?.message}.
                                </span>
                                )}
                            <input
                                type="email"
                                {...register("email", {
                                    required: { value: true, message: "Email is required field" },

                                    // validate: {
                                    //     matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
                                    //         || "Email address must be a valid address",
                                    // },

                                    // or

                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address"
                                    }
                                })}
                                className={`text-md border-2 ${errors.email ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                placeholder="Enter your email"
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
                                {loading ? <Spinner /> : "Sign Up"}
                            </button>
                            <span
                                onClick={() => navigate("/sign-in")}
                                className="text-sm text-gray-800 cursor-pointer"
                            >
                                Already have an account?
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register