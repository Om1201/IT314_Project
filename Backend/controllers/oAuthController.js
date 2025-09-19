import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import {
    buildGoogleAuthUrl,
    buildGoogleTokenUrl,
    buildGoogleUserInfoUrl
} from "../utils/urlHelpers.js";

export const login = async (req, res) => {
    const googleUrl = buildGoogleAuthUrl();
    res.redirect(googleUrl);
};

export const verifyToken = async (req, res) => {
    const { code } = req.query;

    const tokenUrl = buildGoogleTokenUrl(code);
    const response = await axios.post(tokenUrl);
    const { access_token } = response.data;

    const userInfoUrl = buildGoogleUserInfoUrl(access_token);
    const userData = await axios.get(userInfoUrl);
    const { email, name } = userData.data;

    let user = await UserModel.findOne({ email });
    const token = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    if (!user) {
        user = new UserModel({ email, name, isAccountVerified: true });
        await user.save();
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true, message: 'User registered successfully' });
    } else {
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true, message: 'User logged in successfully' });
    }
};
