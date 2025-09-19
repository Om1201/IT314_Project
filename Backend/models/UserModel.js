import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null,
    },
    verifyToken: {
        type: String,
        default: ''
    },
    verifyTokenExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
        default: ''
    },
    resetTokenExpireAt: {
        type: Number,
        default: 0    
    },
})

const UserModel = mongoose.models.user || mongoose.model('user', userSchema);

export default UserModel