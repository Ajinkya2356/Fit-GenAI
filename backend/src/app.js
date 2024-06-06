import express from "express";
import RateLimiter from "express-rate-limit";
import userRouter from "./Routes/user.routes.js";
import categoryRouter from "./Routes/category.routes.js";
import exerciseRouter from "./Routes/exercise.routes.js";
import workoutRouter from "./Routes/workout.routes.js";
import planRouter from "./Routes/plan.routes.js";
import challengeRouter from "./Routes/challenge.routes.js";
import commentRouter from "./Routes/comment.routes.js";
import postRouter from "./Routes/post.routes.js";
import collectionRouter from "./Routes/collection.routes.js";
import bookmarkRouter from "./Routes/bookmark.routes.js";
import stepRouter from "./Routes/steps.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const limiter = RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);
app.use(express.json({ limit: "50kb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/exercise", exerciseRouter);
app.use("/api/v1/workout", workoutRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/bookmark", bookmarkRouter);
app.use("/api/v1/step", stepRouter);
export default app;
