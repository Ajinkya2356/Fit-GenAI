import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./user/userSlice";
import workoutReducer from "./workout/workoutSlice";
import exerciseReducer from "./exercise/exerciseSlice";
import challengeReducer from "./challenge/challengeSlice";
import commentReducer from "./comment/commentSlice";
import categoryReducer from "./category/categorySlice";
import postReducer from "./posts/postSlice";
import collectionReducer from "./collection/collectionSlice";
import stepReducer from "./stepDetail/stepDetailSlice";
import planReducer from "./plan/planSlice";
export const store = configureStore({
  reducer: {
    USER: loginReducer,
    WORKOUT: workoutReducer,
    EXERCISE: exerciseReducer,
    CHALLENGE: challengeReducer,
    COMMENT: commentReducer,
    CATEGORY: categoryReducer,
    POSTS: postReducer,
    COLLECTION: collectionReducer,
    STEP: stepReducer,
    PLANS: planReducer,
  },
});
