import mongoose from "mongoose";
const comment = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
        required: true,
    },
    rating: {
        type: Number,
        default: 3,
    },
    message: {
        type: String,
        required: true,
    }

}, { timestamps: true })
export const Comment = mongoose.model("Comment", comment)