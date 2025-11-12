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
        required : false,
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
});

userSchema.index({ verifyTokenExpireAt: 1 }, { expireAfterSeconds: 0 });

const UserModel = mongoose.models.user || mongoose.model('user', userSchema);

export default UserModel;
