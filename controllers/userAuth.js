const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Helper Functions ---
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1m" } // short-lived
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" } // long-lived
    );
};

// --- Controllers ---
module.exports.testing = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World' });
    } catch (e) {
        console.error(e);
    }
};

module.exports.signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ userName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: 'User saved successfully',
            user: {
                id: newUser.id,
                userName: newUser.userName,
                email: newUser.email
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        const data = await User.find().select("-createdAt -updatedAt");
        res.status(201).json({ message: 'Users Found successfully!!!', data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refreshToken in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login successful 🎉',
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// --- Refresh Token ---
module.exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        // Optional: check refresh token from DB
        const user = await User.findById(decoded.id,null,null);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired refresh token" });
    }
};

// --- Logout ---
module.exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    try {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null; // remove token
            await user.save();
            res.status(200).json({ message: "Logged out successfully" });
        }
        res.status(200).json({ message: "INVALID TOKEN" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};
