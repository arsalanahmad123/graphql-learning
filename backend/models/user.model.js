import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male","female","others"],
    }
},{timestamps: true});

export const User = mongoose.model("User", userSchema);
