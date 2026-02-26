import Task from "../models/Task.js";
import User from "../models/User.js";

export const createNewTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, duedate } = req.body;
    console.log("Req.body: ", req.body);
    
    const user = await User.findOne({ userName: assignedTo });

    if (!user)
      return res.status(400).json({ message: "Assigned user is not found" });

    const newTask = await Task.create({
      title,
      description,
      priority,
      assignedTo: user._id,
      createdBy: req.user._id,
      duedate,
    });

    console.log("New Task: ", newTask);

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal serrver error" });
    console.log("catch error: ", error);
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const getTasks = await Task.find({ createdBy: req.user.id}).populate(
      "assignedTo", "name email"
    );

    res.status(200).json(getTasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Catch error: ", error);
  }
};
