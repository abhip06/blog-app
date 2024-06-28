import { useState } from "react";
import { useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import { UserInfoType } from "../types/types";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import axios from "../Api";
import { useNavigate } from "react-router-dom";

type FormDataType = {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

type EditProfileType = {
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileModal = ({setEditProfile}: EditProfileType) => {

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const authStatus = useSelector((state: any) => state.auth.status);
    const userData: UserInfoType | null = useSelector((state: any) => state.auth.userData?.data?.user);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<FormDataType>({
        defaultValues: {
            fullName: userData?.fullName,
            email: userData?.email
        }
    });

    // Update User Deatils
    const updateUserProfile = async (data: FormDataType) => {
        let isConfirmed = confirm("Are you sure you want to Modify the Blog?");
        if (isConfirmed) {
            try {
                clearErrors();
                setLoading(true);

                let formData = new FormData();

                formData.append("fullName", data?.fullName!);
                formData.append("email", data?.email!);

                console.log(formData);
                const response = await axios.patch(
                    `/api/v1/users/update-profile`,
                    // JSON.stringify(formData),
                    formData,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (response?.data?.statusCode === 200) {
                    alert(response?.data?.message);
                    setEditProfile(false);
                    navigate(`/my-profile`);
                    window.location.reload();
                }
            } catch (error: any) {
                setError("root.serverError", {
                    type: "server-error",
                    message: error?.response?.data?.message || "Something went wrong"
                });
                console.log(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        }
    }


    return authStatus && (
        <div
            className="fixed h-screen w-screen bg-black/50 backdrop-blur-sm top-0 left-0 transition-all">
            <section
                className="text-black bg-white flex-col rounded-lg absolute sm:left-1/3 left-4 top-8 h-5/6 py-8 sm:px-10 px-5 gap-12 z-50 sm:w-1/3 w-11/12 flex">
                <span
                    className="mt-0 mb-8 text-4xl font-bold text-gray-800 cursor-pointer"
                    onClick={() => setEditProfile(false)}
                >
                    {<IoMdClose />}
                </span>
                <form
                className="flex flex-col gap-9"
                onSubmit={handleSubmit(updateUserProfile)}
                >
                    <h1 className="text-3xl text-gray-800">Edit Profile</h1>
                {errors.root?.serverError &&
                            (<span
                                className="text-red-500 text-sm"
                            >
                                {errors.root?.serverError?.message}.
                            </span>
                            )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Name</label>
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
                                    // pattern: { value: /^[A-Za-z]+$/i, message: "You can enter alphabets only" },
                                })}
                                className={`text-md border-2 ${errors.fullName ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Username</label>
                            {errors.username &&
                                (<span
                                    className="text-red-500 text-sm"
                                >
                                    {errors.username?.message}.
                                </span>
                                )}
                            <input
                                type="text"
                                value={userData?.username}
                                {...register("username", {
                                    required: { value: true, message: "Username is required field" },
                                })}
                                className={`text-md border-2 ${errors.username ? "border-red-500" : "border-green-500"} rounded-lg text-gray-600 outline-none overflow-hidden py-2 px-4`}
                                placeholder="Set new username"
                            />
                        </div> */}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-green-600">Email</label>
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
                                placeholder="Enter new email"
                            />
                        </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="sm:w-2/4 w-full px-3 py-2 text-lg border border-green-500 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 disabled:bg-white disabled:text-green-500"
                            >
                                {loading ? <Spinner /> : "Save Changes"}
                            </button>
                </form>
            </section>
        </div>
    )
}

export default EditProfileModal