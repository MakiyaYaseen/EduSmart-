import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");
    if (!user) return res.status(404).json({ message: "User not Found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `GetCurrentUser error: ${error}` });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    let photoUrl;
    if (req.file) {
      photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const updateData = { name, description };
    if (photoUrl) updateData.photoUrl = photoUrl;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not Found" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `updateProfile error: ${error}` });
  }
};

export const getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const totalCertificates = await User.countDocuments({
      "courseProgress.certificateIssued": true
    });
    return res.status(200).json({ studentCount, totalCertificates });
  } catch (error) {
    return res.status(500).json({ message: `getStats error: ${error}` });
  }
};
