import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import {
    buildGoogleAuthUrl,
    buildGoogleTokenParams,
} from "../utils/urlHelpers.js";

export const login = async (req, res) => {
    const googleUrl = buildGoogleAuthUrl();
    res.redirect(googleUrl);
};


export const verifyToken = async (req, res) => {
  const { code } = req.body; 

  if (!code) return res.status(400).json({ success: false, message: "Code missing" });

  try {
    const params = buildGoogleTokenParams(code);

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) throw new Error("Failed to obtain access token");

    const userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    const userDataResponse = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { email, name } = userDataResponse.data;

    let user = await UserModel.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (!user) {
      user = new UserModel({ email, name, isAccountVerified: true });
      await user.save();
      return res.json({ success: true, message: "User registered successfully" });
    } else {
      return res.json({ success: true, message: "User logged in successfully" });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
