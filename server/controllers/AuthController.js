const { UserModel } = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function createToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SCRETE_KEY);
  return token;
}

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "User Already Exits" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    const userdetails = await newUser.save();
    const token = createToken(userdetails._id);
    // await res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: false, // Should be `true` in production
    //   sameSite: "Lax", // Can also be "Strict" or "None"
    // });
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      userdetails,
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Exists" });
    }
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(user._id);
    // await res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: false, // Should be `true` in production
    //   sameSite: "Lax", // Can also be "Strict" or "None"
    // });
    const { password: _, ...userdetails } = user._doc;
    return res
      .status(201)
      .json({ success: true, message: "Login Success", userdetails, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const google = async (req, res) => {
  const { name, email, photo } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const token = createToken(user._id);
      const { password: _, ...userdetails } = user._doc;
      return res.status(201).json({
        success: true,
        message: "Sign In Success",
        token,
        userdetails,
      });
    }
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
    const newUser = await UserModel({
      username: name,
      email: email,
      password: hashedPassword,
      avatar: photo,
    });
    const userNew = await newUser.save();

    const { password: _, ...userdetails } = userNew._doc;
    const token = createToken(newUser._id);
    return res.status(201).json({
      success: true,
      message: "Sign Up Success",
      userdetails,
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const signout = async (req, res) => {
  try {
    return res
      .status(201)
      .json({ success: true, message: "Log Out Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, signin, google, signout };
