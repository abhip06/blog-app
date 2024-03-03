class ApiError extends Error {
    public success: boolean;
    
    constructor(public statusCode: number | 500, public message: string | "Something went wrong.", public errors?: Array<Error> | [], public stack?: string | "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }