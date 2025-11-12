import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { buildGoogleAuthUrl, buildGoogleTokenParams, buildGithubAuthUrl, buildGithubTokenParams } from '../utils/urlHelpers.js';

export const login = async (req, res) => {
    const googleUrl = buildGoogleAuthUrl();
    res.redirect(googleUrl);
};

export const verifyToken = async (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ success: false, message: 'Code missing' });

    try {
        const params = buildGoogleTokenParams(code);

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token } = tokenResponse.data;
        if (!access_token) throw new Error('Failed to obtain access token');

        const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        const userDataResponse = await axios.get(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const { email, name } = userDataResponse.data;

        let user = await UserModel.findOne({ email });
        if (!user) {
            user = new UserModel({ email, name, isAccountVerified: true });
            await user.save();
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // if (!user) {
        //   return res.json({ success: true, message: "User registered successfully" });
        // } else {
        return res.json({
            success: true,
            message: 'User logged in successfully',
            user: { email, name },
        });
        // }
    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const githubLogin = async (req, res)=> {
    const githubUrl = buildGithubAuthUrl();
    res.redirect(githubUrl);
}

export const githubVerifyToken = async (req, res)=> {
    const {code} = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code missing' });

    try {
        const params = buildGithubTokenParams(code);

        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }
        );

        const { access_token } = tokenResponse.data;
        if (!access_token) throw new Error('Failed to obtain access token');

        // Fetch user profile
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/vnd.github+json' },
        });

        let email = userResponse.data.email || null;
        if (!email) {
            const emailsResponse = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/vnd.github+json' },
            });
            const primaryVerified = emailsResponse.data.find(e => e.primary && e.verified) ||
                                    emailsResponse.data.find(e => e.verified) ||
                                    emailsResponse.data[0];
            email = primaryVerified?.email || null;
        }

        const name = userResponse.data.name || userResponse.data.login;
        const githubId = String(userResponse.data.login);

        if (!email) {
           return res.status(400).json({ success: false, message: 'Unable to retrieve email from GitHub account' });
        }

        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.findOne({ githubId });
        }

        if (!user) {
            user = new UserModel({
                email,
                name,
                githubId,
                isAccountVerified: true,
            });  
        } else {
            if (!user.githubId) {
                user.githubId = githubId;
            }
            if (!user.isAccountVerified) {
                user.isAccountVerified = true;
               
            }
        }
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: 'User logged in successfully',
            user: { email: user.email, name: user.name },
        });
    } catch (error) {
        console.error(`Got some err  ${error.response?.data || error.message}`);
        return res.status(500).json({ success: false, message: error.message });
    }
};