import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    // otp in hahsed format
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user is required"]
    },
    // otp in hashed format
    otpHash: {
        type: String,
        required: [true, "OTP hash is reuqired"]
    }
}, {
    timestamps: true
})

const otpModel = mongoose.model("otps", otpSchema)

export default otpModel