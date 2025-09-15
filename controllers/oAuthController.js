import express from "express";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";


export const login = async(req, res)=> {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'email profile',
    })
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.redirect(googleUrl);
}

export const verifyToken = async(req,res)=> {
    const {code} = req.query;
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        code: code,
        grant_type: 'authorization_code',
    });
    const googleUrl = `https://oauth2.googleapis.com/token?${params.toString()}`;
    const response = await axios.post(googleUrl);
    const {access_token} = response.data;

    //get user data
    const userData = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`);
    const {email, name} = userData.data;

    //check it user exist
    const user = await UserModel.findOne({email});
    //generate token
    const token = jwt.sign({email, name}, process.env.JWT_SECRET, {expiresIn: '7d'});
   if(!user){
        //create user
        const newUser = new UserModel({email, name, isAccountVerified: true});
        await newUser.save();
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        return res.return({success: true, message: 'User registered successfully'});
   }else{
        //user already exists
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        return res.return({success: true, message: 'User logged in successfully'});
   }
}