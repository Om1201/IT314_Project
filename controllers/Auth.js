import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/mailer.js"
import crypto from "crypto"

export const register = async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'});
    }
    try{
        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomUUID();
        
        const user = new UserModel({name, email, password: hashedPass, verifyToken, 
            verifyTokenExpireAt:Date.now() + 1000*60*15,
        });
        const verifyUrl = `http://localhost:5173/verifyAccount?token=${verifyToken}&email=${email}`;
        await user.save();
        
        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to this website',
            text: `Welcome to this website. Your account has been created with email id: ${email}. Kindly click on the url below ${verifyUrl}`
        }
        
        try {
            
            await transporter.sendMail(mailOptions);
            
            
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        
        
        return res.json({success: true})
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

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
        const matched = (user.verifyToken==token);
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

// export const resendToken = async(req, res)=>{
//     const {email} = req.body;
//     if(!email){
//         return res.json({ success: false, message: "Email required" });
//     }
//     try{
//         const user = await UserModel.findOne({email});
//         if(!user) {
//             return res.json({ success: false, message: "User not found" });
//         }
//         const verifyToken = crypto.randomUUID();
//         const update = await UserModel.updateOne({email}, {verifyToken: verifyToken});
//     }
// }