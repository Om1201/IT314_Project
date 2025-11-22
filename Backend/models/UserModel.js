import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    githubId: {
        type: String,
        unique: true,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: null,
    },
    verifyToken: {
        type: String,
        default: '',
    },
    verifyTokenExpireAt: {
        type: Date,
        default: new Date('9999-12-31'),
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
        default: '',
    },
    resetTokenExpireAt: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    avatarPublicId: {
        type: String,
        default: '',
    },
    github: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    lastLoginDate: {
        type: Date,
        default: null,
    },
    streakCount: {
        type: Number,
        default: 1,
    },
    maxStreak: {
        type: Number,
        default: 1,
    },
    loginDates: {
        type: [Date], 
        default: [],
    },
});


const UserModel = mongoose.models.user || mongoose.model('user', userSchema);

export default UserModel;
