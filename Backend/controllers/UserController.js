import User from "../models/UserModel.js";
import Roadmap from "../models/RoadmapModel.js";
import Chat from "../models/ChatModel.js";
import Note from "../models/NoteModel.js";
import bcrypt from "bcryptjs";


export const getProfile = async (req, res) => {
  try {
    const {userId} = req;

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({success: true, data: user});
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const {userId, email} = req;

    const notesCount = await Note.countDocuments({ userId });
    const chatCount = await Chat.countDocuments({ email });
    const roadmapCount = await Roadmap.countDocuments({ email });

    const stats = {
      coursesCompleted: roadmapCount,
      hoursLearned: chatCount * 0.2, 
      currentStreak: 5, 
      totalPoints: notesCount * 10 + chatCount * 2,
    };

    return res.status(200).json({success: true, data: stats});
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getUserRoadmaps = async (req, res) => {
  try {
    const {email} = req;

    const roadmaps = await Roadmap.find({ email });

    return res.status(200).json({success: true, data: roadmaps});
  } catch (err) {
    console.error("getUserRoadmaps error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const changePassword = async (req, res) => {
  try {
    const {userId} = req;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
