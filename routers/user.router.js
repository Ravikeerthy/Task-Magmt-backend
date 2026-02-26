import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  forgetPassword,
  logout,
  registerUser,
  resetPassword,
  userLogin,
  userProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.post("forgetPassword", forgetPassword);
userRouter.post("/newPassword", resetPassword);
userRouter.get("/profile", protect, userProfile);
userRouter.post("/logout", protect, logout)

export default userRouter;
