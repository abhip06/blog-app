
export type UserInfoType = {
    _id?: string;
    fullName: string;
    email: string;
    username: string;
    avatar?: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDataResponse = {
    statusCode: number;
    data: UserInfoType;
    message: string;
    success: boolean;
}

export type BlogDataType = {
    _id?: string;
    title: string;
    content: string;
    blogImage: string;
    category: string;
    publisher: string;
    isTopRated?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
