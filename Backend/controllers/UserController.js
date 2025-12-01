import User from "../models/UserModel.js";
import Roadmap from "../models/RoadmapModel.js";
import Chat from "../models/ChatModel.js";
import Note from "../models/NoteModel.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../utils/cloudinary.js";


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
    const { userId, email } = req;

    const [user, roadmapCount] = await Promise.all([
      User.findById(userId).select('streakCount maxStreak loginDates').lean(),
      Roadmap.countDocuments({ email }),
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const coursesCompleted = 0;
    const roadmaps = await Roadmap.find({ email });
    const filteredRoadmaps = roadmaps.filter(rm => {
      let valid = true;
      for (const chapter of rm.roadmapData.chapters) {
        for (const topic of chapter.subtopics) {
          if(topic.completed == false){
            valid = false;
            break;
          }
        }
        if (!valid) break;
      }
      if(valid) return rm;
    })
    const stats = {
      totalRoadmaps: roadmapCount,
      coursesCompleted: filteredRoadmaps.length,
      currentStreak: user.streakCount || 0,
      maxStreak: user.maxStreak || 0,
      loginDates: Array.isArray(user.loginDates) ? user.loginDates : [],
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
    const { oldPassword, newPassword } = req.validatedData;

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

const sanitize = (str = "") => str.replace(/[<>]/g, "").trim();
const normalizeWhitespace = (str = "") => str.replace(/\s+/g, " ").trim();

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const allowed = ["name", "title", "bio", "location", "github", "linkedin", "twitter"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body && typeof req.body[key] === 'string') {
        if (key === 'bio') {
          updates[key] = sanitize(req.body[key]);
        } else if (key === 'name') {
          updates[key] = normalizeWhitespace(sanitize(req.body[key]));
        } else if (key === 'location') {
          updates[key] = normalizeWhitespace(sanitize(req.body[key]));
        } else {
          updates[key] = req.body[key].trim();
        }
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No profile fields provided." });
    }
    if (updates.name !== undefined) {
      const nameRegex = /^[\p{L}][\p{L}\s'.-]*$/u;
      if (!updates.name) {
        return res.status(400).json({ success: false, message: "Name is required." });
      }
      if (updates.name.length < 2 || updates.name.length > 25) {
        return res.status(400).json({ success: false, message: "Name must be between 2 and 25 characters." });
      }
      if (!nameRegex.test(updates.name)) {
        return res.status(400).json({ success: false, message: "Name contains invalid characters." });
      }
    }
    const locationRegex = /^[a-zA-Z\s,.-]+$/;
    if (updates.location && !locationRegex.test(updates.location)) {
        return res.status(400).json({ 
             success: false, 
              message: "Location cannot contain numbers or special characters." 
          });
     }

     const urlRegex = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.[\w\d]+(\/.*)?$/; 
    const handleRegex = /^@?[a-zA-Z0-9_.-]+$/; 

    const socialFields = ["github", "linkedin", "twitter"];
    for (const field of socialFields) {
        if (updates[field]) {
            const val = updates[field];
            if (!urlRegex.test(val) && !handleRegex.test(val)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Invalid format for ${field}. Please enter a valid URL or username.` 
                });
            }
            if (val.length > 200) {
                return res.status(400).json({ success: false, message: `${field} link too long (max 200).` });
            }
        }
    }
    if (updates.title && updates.title.length > 100) {
      return res.status(400).json({ success: false, message: "Title too long (max 100)." });
    }
    if (updates.title && !/^[\w\s',.&-]+$/.test(updates.title)) {
      return res.status(400).json({ success: false, message: "Title contains invalid characters." });
    }
    if (updates.bio && updates.bio.length > 1000) {
      return res.status(400).json({ success: false, message: "Bio too long (max 1000)." });
    }
    if (updates.location && updates.location.length > 100) {
      return res.status(400).json({ success: false, message: "Location too long (max 100)." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    Object.assign(user, updates);
    await user.save();

    const safeUser = await User.findById(userId).select('-password');
    return res.status(200).json({ success: true, data: safeUser });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req;
    const { dataUri } = req.body || {};
    if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
      return res.status(400).json({ success: false, message: 'Invalid image data' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await uploadImage(dataUri, { folder: 'avatars' });

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    const safe = await User.findById(userId).select('-password');
    return res.status(200).json({ success: true, data: safe });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const notes = await Note.find({ userId }).lean();
    return res.status(200).json({ success: true, data: notes });
  } catch (err) {
    console.error('getAllNotes error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const purgeUserData = async (req, res) => {
  try {
    const { userId, email } = req;
    if (!userId || !email) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [roadmapResult, chatResult, noteResult] = await Promise.all([
      Roadmap.deleteMany({ email }),
      Chat.deleteMany({ email }),
      Note.deleteMany({ userId }),
    ]);


    user.title = '';
    user.bio = '';
    user.location = '';
    user.avatar = '';
    user.avatarPublicId = '';
    user.github = '';
    user.linkedin = '';
    user.twitter = '';
    user.streakCount = 0;
    user.maxStreak = 0;
    user.loginDates = [];
    await user.save();

    const safeUser = await User.findById(userId).select('-password');
    return res.status(200).json({
      success: true,
      message: 'All user data purged successfully',
      meta: {
        roadmapsDeleted: roadmapResult.deletedCount,
        chatsDeleted: chatResult.deletedCount,
        notesDeleted: noteResult.deletedCount,
      },
      data: safeUser,
    });
  } catch (err) {
    console.error('purgeUserData error:', err);
    return res.status(500).json({ success: false, message: 'Failed to purge user data' });
  }
};
