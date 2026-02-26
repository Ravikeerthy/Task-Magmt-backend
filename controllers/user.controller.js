import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from "crypto-js";
import crypto from "crypto";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";


dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    console.log("req Body", req.body);
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email });
    console.log("Existing User: ", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email: lowerCaseEmail,
      password,
      role
    });
    await newUser.save();
    console.log("New User Saved: ", newUser);

    const token = newUser.generateToken();

    res.status(201).json({
      success: true,
      token,
      newUser: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Req Body", req.body);

    const lowerCaseEmail = email.toLowerCase();
    console.log("LowerCase: ", lowerCaseEmail);

    const userFind = await User.findOne({ email: lowerCaseEmail });
    console.log("User Find: ", userFind);

    if (!userFind) {
      return res.status(400).json({ message: "User does'nt exits" });
    }

    const comaprePwd = await bcrypt.compare(password, userFind.password);
    console.log("Compare Pwd: ", comaprePwd);

    if (!comaprePwd) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // const token = jwt.sign(
    //   {
    //     userId: userFind._id,
    //   },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "1d" }
    // );
    // console.log("Token: ", token);

    const token = userFind.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({
        message: "Login Successful",
        token,
        userId: userFind._id,
        userName: userFind.userName,
        email: userFind.email,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not fouond" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Reset token: ", resetToken);
    
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = ` ${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `<h2>Password Reset</h2>
    <p>You requested a passsword reset</p>
    <p>Click the link below</p>
    <a href = "${resetUrl} ">${resetUrl}</a>
    <p>This link expires in 15 mins</p>`;

    await sendEmail({
      email:user.email,
      subject:"Password Rest Request",
      message
    })
    res
      .status(200)
      .json({ message: "Password reset token generated and sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Forget Pwd Error: ", error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newpassword } = req.body;
   

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newpassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Reset Password: ", error);
  }
};

export const userProfile = async (req, res) => {
  try {
    res.status(200).json({ message: "This is your Profile...",  user: req.user });
  } catch (error) {
    console.log("Profile reset error: ", error);    
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

