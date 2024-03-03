import express, { Express } from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));
// app.use(cookieParser());

// routes imports
import UserRouter from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

// routes decleration
app.use("/api/v1/users", UserRouter);

// Error middleware
app.use(errorMiddleware);

export { app };