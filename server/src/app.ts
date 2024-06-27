import express, { Express } from "express";
import cors from "cors";
// import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app: Express = express();

// dotenv.config();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "64kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

// routes imports
import UserRouter from "./routes/user.routes";
import BlogRouter from "./routes/blog.routes"
import { errorMiddleware } from "./middlewares/errorMiddleware";

// routes decleration
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/blogs", BlogRouter);

// Error middleware
app.use(errorMiddleware);

export { app };