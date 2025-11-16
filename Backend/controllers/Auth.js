import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js';
import crypto from 'crypto';
import { passwordResetEmail, verificationEmail } from '../utils/emailTemplates.js';
import { buildEmailVerifyUrl, buildResetPasswordUrl, buildVerifyAccountUrl } from '../utils/urlHelpers.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.validatedData;

        // const response = await fetch(buildEmailVerifyUrl(email));
        // if(response.reason != "valid_mailbox" || response.smtp_check != true || response.state != "deliverable"){
        //     return res.status(400).json({ success: false, message: 'Email is not valid' });
        // }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            if (existingUser.isAccountVerified == false) {
                const hashedPass = await bcrypt.hash(password, 10);
                existingUser.name = name;
                existingUser.password = hashedPass;
                const verifyToken = crypto.randomUUID();
                const expireAt = new Date(Date.now() + 1000 * 60 * 15);
                existingUser.verifyToken = verifyToken;
                existingUser.verifyTokenExpireAt = expireAt;
                const verifyUrl = buildVerifyAccountUrl(verifyToken);
                await existingUser.save();

                const { subject, html } = verificationEmail(email, verifyUrl);
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject,
                    html,
                };
                try {
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                }
                return res.status(200).json({
                    success: true,
                    message: 'Please check your email to verify your account.',
                });
            }
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomUUID();

        const expireAt = new Date(Date.now() + 1000 * 60 * 15);

        const user = new UserModel({
            name,
            email,
            password: hashedPass,
            verifyToken,
            verifyTokenExpireAt: expireAt,
        });

        const verifyUrl = buildVerifyAccountUrl(verifyToken);
        await user.save();

        const { subject, html } = verificationEmail(email, verifyUrl);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        return res.status(201).json({
            success: true,
            message:
                'User registered successfully. Please check your email to verify your account.',
        });
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

async function updateLoginStreak(user) {
    try {
        const today = new Date();
        const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
        const todayMid = new Date(todayUTC);

        if (!user.lastLoginDate) {
            user.streakCount = 1;
        } else {
            const last = new Date(user.lastLoginDate);
            const lastUTC = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
            const diffDays = Math.floor((todayUTC - lastUTC) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) {
            } else if (diffDays === 1) {
                user.streakCount = user.streakCount + 1;
            } else {
                user.streakCount = 1;
            }
        }

        user.lastLoginDate = today;
        if ((user.maxStreak) < (user.streakCount)) {
            user.maxStreak = user.streakCount;
        }

        if (!Array.isArray(user.loginDates)) {
            user.loginDates = [];
        }
        const hasToday = user.loginDates.some(d => {
            const dd = new Date(d);
            return dd.getUTCFullYear() === today.getUTCFullYear() && dd.getUTCMonth() === today.getUTCMonth() && dd.getUTCDate() === today.getUTCDate();
        });
        if (!hasToday) {
            user.loginDates.push(todayMid);
            if (user.loginDates.length > 730) {
                user.loginDates = user.loginDates.slice(-730);
            }
        }

        await user.save();
        return user;
    } catch (err) {
        console.error('updateLoginStreak error:', err);
        return user;
    }
}

export const verifyAccount = async (req, res) => {
    const { token } = req.validatedData;

    try {
        const user = await UserModel.findOne({ verifyToken: token });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Link is not valid' });
        }
        const matched = user.verifyToken === token;
        if (!matched) {
            return res.status(400).json({ success: false, message: 'Link in not valid' });
        }
        if (user.verifyTokenExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'Link is Expired' });
        }
        const update = await UserModel.updateOne(
            { verifyToken: token },
            {
                isAccountVerified: true,
                verifyToken: '',
                verifyTokenExpireAt: new Date('9999-12-31'),
            }
        );

        return res.status(200).json({ success: true, message: 'Account verified' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.validatedData;
    try {
        const user = await UserModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.password === null) {
            return res
                .status(400)
                .json({ success: false, message: 'User exists, No password found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }
        if (user.isAccountVerified == false) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Account not verified. Please verify your account.',
                });
        }
        const token = jwt.sign({ id: user._id, email: user.email}, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        try {
            await updateLoginStreak(user);
        } catch (e) {
            console.error('Streak update failed during signin:', e);
        }

        return res.status(200).json({ success: true, message: 'Signin successful', user: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        const userId = req.userId;
        let user = await UserModel.findById(userId);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        try {
            user = await updateLoginStreak(user);
        } catch (err) {
            console.error('Streak update failed during isAuthenticated:', err);
        }

        const safe = {
            name: user.name,
            email: user.email,
            streakCount: user.streakCount,
            lastLoginDate: user.lastLoginDate,
            maxStreak: user.maxStreak,
            loginDates: Array.isArray(user.loginDates) ? user.loginDates : [],
        };
        return res.status(200).json({ success: true, user: safe });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sendResetToken = async (req, res) => {
    const { email } = req.validatedData;

    if (!email) {
        return res.json({ success: false, message: 'Email required' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const resetToken = crypto.randomUUID();
        const update = await UserModel.updateOne(
            { email },
            { resetToken: resetToken, resetTokenExpireAt: Date.now() + 1000 * 60 * 15 }
        );

        const resetUrl = buildResetPasswordUrl(resetToken);

        const { subject, html } = passwordResetEmail(email, resetUrl);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        return res
            .status(200)
            .json({
                success: true,
                message: 'Password reset token sent. Please check your email.',
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyResetToken = async (req, res) => {
    const { token: resetToken } = req.validatedData;

    // console.log(email);
    try {
        const user = await UserModel.findOne({ resetToken });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Link is not valid' });
        }
        if (user.resetToken === '' || user.resetToken !== resetToken) {
            return res.status(400).json({ success: false, message: 'Link is not valid' });
        }
        if (user.resetTokenExpireAt < Date.now()) {
            user.resetToken = null;
            user.resetTokenExpireAt = 0;
            await user.save();
            return res.json({ success: false, message: 'Link expired' });
        }

        return res
            .status(200)
            .json({ success: true, message: 'Enter new password', email: user.email });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword, token: resetToken } = req.validatedData;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.resetToken === '' || user.resetToken !== resetToken) {
            return res.status(400).json({ success: false, message: 'Invalid Link.' });
        }
        if (user.resetTokenExpireAt < Date.now()) {
            user.resetToken = null;
            user.resetTokenExpireAt = 0;
            await user.save();
            return res.json({ success: false, message: 'Link expired' });
        }

        user.resetToken = null;
        user.resetTokenExpireAt = 0;
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res
            .status(200)
            .json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
