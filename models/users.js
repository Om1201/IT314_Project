const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // prevent duplicate emails
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
