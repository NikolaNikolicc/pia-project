import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        name: String,
        surname: String,
        gender: String,
        address: String,
        phone: String,
        email: String,
        profilePicture: Boolean,
        creditCard: String,
        userType: Number,
        pendingApproval: Boolean,
    },{
        versionKey:false  
    }
);

export default mongoose.model("UserModel", userSchema, 'users');