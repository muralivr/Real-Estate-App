const { ListModel } = require("../models/ListModel.js");
const { UserModel } = require("../models/UserModel.js");
const bcryptjs = require("bcryptjs");

const test = async (req, res) => {
  res.send("Hello World");
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, avatar } = req.body; // Use req.body instead of req.user

  try {
    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hash the password only if it's provided
    const updatedData = {
      username: username || user.username,
      email: email || user.email,
      avatar: avatar || user.avatar,
    };

    if (password) {
      updatedData.password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    // Return the updated user details
    const { password: _, ...userdetails } = updatedUser._doc;
    return res.status(200).json({
      success: true,
      userdetails,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json({
      success: false,
      message: "You can delete only your own account",
    });
  }
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    return res
      .status(201)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserList = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const list = await ListModel.find({ userRef: req.params.id });
      return res.status(201).json({ success: true, list });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  } else {
    return res
      .status(500)
      .json({ success: false, message: "You can only view your own listings" });
  }
};

const allUsers = async (req, res) => {
  try {
    const user = await UserModel.find({});
    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const { password: _, ...userdetails } = user._doc;
    return res.status(201).json({ success: true, userdetails });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

module.exports = { test, updateUser, deleteUser, getUserList, allUsers, getUser };
