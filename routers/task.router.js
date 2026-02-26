import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createNewTask, getAllTasks } from "../controllers/task.controller.js";

const taskRoutes = express.Router();

taskRoutes.post("/createnewtask", protect, createNewTask);
taskRoutes.get("/getalltasks", protect, getAllTasks);

export default taskRoutes;