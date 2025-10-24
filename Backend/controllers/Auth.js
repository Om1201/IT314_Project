import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/mailer.js"
import crypto from "crypto"
import {passwordResetEmail, verificationEmail} from "../utils/emailTemplates.js";
import {buildResetPasswordUrl, buildVerifyAccountUrl} from "../utils/urlHelpers.js";

export const register = async (req, res) => {
    try {
        
        const { name, email, password } = req.validatedData;
        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
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

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email to verify your account.",
        }); 
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

export const verifyAccount = async(req, res)=> {
    const { token } = req.validatedData;
    
    try{
        const user = await UserModel.findOne({verifyToken: token});
        if(!user){
            return res.status(404).json({ success: false, message: "Link is not valid" });
        }
        const matched = (user.verifyToken===token);
        if(!matched){
            return res.status(400).json({ success: false, message: "Link in not valid" });
        }
        if(user.verifyTokenExpireAt < Date.now()){
            return res.status(400).json({ success: false, message: "Link is Expired" });
        }
        const update = await UserModel.updateOne({verifyToken: token}, {isAccountVerified: true, verifyToken: '', verifyTokenExpireAt: 0});
        
        // const jwttoken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        // res.cookie('token', jwttoken, {
        //     httpOnly: true,
        //     // secure: true,
        //     // sameSite: "None",
        //     maxAge: 7*24*60*60*1000
        // })
        
        return res.status(200).json({ success: true, message: "Account verified" });
    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const signIn = async(req, res)=>{
    const { email, password } = req.validatedData;
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message:'User not found'});
        }
        if(user.password===null){
            return res.status(400).json({success: false, message: "User exists, No password found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success: false, message:'Incorrect password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        
        return res.status(200).json({success: true, message: "Signin successful", user: user});
        
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
}

export const logout = async(req, res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            // secure: true,
            // sameSite: "None",
        })
        return res.status(200).json({success: true, message: 'Logged out'})
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message});
        
    }
}

export const isAuthenticated = async(req, res)=>{
    try{
        const userId = req.userId;
        const user = await UserModel.findById(userId).select('name email');
        return res.status(200).json({success:true, user});
    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}


export const sendResetToken = async(req, res) =>{
    const { email } = req.validatedData;
    
    if(!email) {
        return res.json({success: false, message: "Email required"});
    }
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const resetToken = crypto.randomUUID();
        const update = await UserModel.updateOne({email}, {resetToken: resetToken, resetTokenExpireAt: Date.now()+1000*60*15});

        const resetUrl = buildResetPasswordUrl(resetToken);

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
        return res.status(200).json({ success: true, message: "Password reset token sent. Please check your email."})
    }catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const verifyResetToken = async(req, res)=>{
    const { token: resetToken } = req.validatedData;

    // console.log(email);
    try{
        const user = await UserModel.findOne({resetToken});
        if(!user){
            return res.status(404).json({success: false, message: "Link is not valid"})
        }
        if(user.resetToken==='' || user.resetToken!==resetToken){
            return res.status(400).json({success: false, message: "Link is not valid"})
        }
        if(user.resetTokenExpireAt < Date.now()){
            user.resetToken = null;
            user.resetTokenExpireAt = 0;
            await user.save();
            return res.json({success: false, message: "Link expired"})
        }

        
        return res.status(200).json({success: true, message: "Enter new password", email: user.email})
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}

export const resetPassword = async(req, res)=>{
    const {email, newPassword, token: resetToken} = req.validatedData;
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({success:false, message: "User not found."});  
        }

        if(user.resetToken==='' || user.resetToken!==resetToken){
            return res.status(400).json({success: false, message: "Invalid Link."})
        }
        if(user.resetTokenExpireAt < Date.now()){
            user.resetToken = null;
            user.resetTokenExpireAt = 0;
            await user.save();
            return res.json({success: false, message: "Link expired"})
        }

        user.resetToken = null;
        user.resetTokenExpireAt = 0;
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({success:true, message: "Password has been reset successfully."});  
    }catch(error){
        return res.status(500).json({success:false, message: error.message});  
    }
}