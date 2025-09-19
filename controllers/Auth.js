import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/mailer.js"
import crypto from "crypto"
import axios from "axios"
import {passwordResetEmail, verificationEmail} from "../utils/emailTemplates.js";
import {buildResetPasswordUrl, buildVerifyAccountUrl} from "../utils/urlHelpers.js";

// Captcha verification function simply calls an google API to verify the token , you need to add recaptcha secret key in .env file
const verifyRecaptcha = async (recaptchaToken) => {
    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
};

export const register = async (req, res) => {
    const { name, email, password, recaptchaToken } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }
     // Verify reCAPTCHA  this will be skipped in development mode to run it we will have to set NODE_ENV to production in .env file
    if (process.env.NODE_ENV !== 'development') {
        if (!recaptchaToken) {
            return res.json({success: false, message: 'Please complete the security verification'});
        }
        
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.json({success: false, message: 'Security verification failed. Please try again.'});
        }
    }


    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomUUID();

        const user = new UserModel({
            name,
            email,
            password: hashedPass,
            verifyToken,
            verifyTokenExpireAt: Date.now() + 1000 * 60 * 15, // 15 min
        });

        const verifyUrl = buildVerifyAccountUrl(verifyToken, email);
        await user.save();

        const { subject, text } = verificationEmail(email, verifyUrl);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            text,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const verifyAccount = async(req, res)=> {
    const {token, email} = req.body;
    
    if(!token || !email){
        return res.json({ success: false, message: "Missing details" })
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }
        const matched = (user.verifyToken===token);
        if(!matched){
            return res.json({ success: false, message: "Link in not valid" });
        }
        if(user.verifyTokenExpireAt < Date.now()){
            return res.json({ success: false, message: "Link is Expired" });
        }
        const update = await UserModel.updateOne({email}, {isAccountVerified: true, verifyToken: '', verifyTokenExpireAt: 0});
        
        const jwttoken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', jwttoken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        
        return res.json({ success: true, message: "Account verified" });
    }catch(error){
        return res.json({ success: false, message: error.message });
    }
}

export const signIn = async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({success: false, message:'Email and password are required'});
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success: false, message:'Invalid email'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message:'Incorrect password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        
        return res.json({success: true})
        
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const logout = async(req, res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })
        return res.json({success: true, message: 'Logged out'})
    }
    catch(error){
        return res.json({success: false, message: error.message});
        
    }
}

export const isAuthenticated = async(req, res)=>{
    try{
        return res.json({success:true}) 
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}


export const sendResetToken = async(req, res) =>{
    const {email} = req.body;
    
    if(!email) {
        return res.json({success: false, message: "Email required"});
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        const resetToken = crypto.randomUUID();
        const update = await UserModel.updateOne({email}, {resetToken: resetToken, resetTokenExpireAt: Date.now()+1000*60*15});

        const resetUrl = buildResetPasswordUrl(resetToken, email);

        const { subject, text } = passwordResetEmail(email, resetUrl);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            text,
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        return res.json({success: true, message: "Reset token sent to your email"});
    }catch(error){
        return res.json({ success: false, message: error.message });
    }
}


export const verifyResetToken = async(req, res)=>{
    const {email, resetToken} = req.body;

    if(!email || !resetToken){
        return res.json({success:false, message: "Missing Details."})
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found."})
        }
        if(user.resetToken==='' || user.resetToken!==resetToken){
            return res.json({success: false, message: "Invalid Link."})
        }
        if(user.resetTokenExpireAt < Date.now()){
            user.resetToken = null;
            user.resetTokenExpireAt = 0;
            await user.save();
            return res.json({success: false, message: "Link expired"})
        }

        user.resetToken = null;
        user.resetTokenExpireAt = 0;
        await user.save();
        return res.json({success: true, message: "Enter new password"})
    }
    catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const resetPassword = async(req, res)=>{
    const {email, newPassword} = req.body;
    if(!newPassword){
        return res.json({success:false, message: "New password is required."});  
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User not found."});  
        }
        
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpireAt = 0;
        await user.save();
        
        return res.json({success:true, message: "Password has been reset successfully."});
    }catch(error){
        return res.json({success:false, message: error.message});  
    }
}