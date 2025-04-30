import express from "express";
import Task from "../models/Task.js";
import Group from '../models/Groups.js';
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  let tasks = await Task.find({ userId: req.userId });

  res.json(tasks);
});

// Add new task
router.post("/", async (req, res) => {
  console.log(req.body)
  try {
    const { title, groupId } = req.body;

    // Step 1: Create the task
    const task = await Task.create({ title, completed: false, userId: req.userId });
    
    // Step 2: Find the group and add the task to it
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add task to the group's tasks array
    group.tasks.push(task._id);
    await group.save();

    res.status(201).json(task); // Return the created task
  } catch (error) {
    console.error('Error creating task and adding to group', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Mark task as completed by user
router.post("/:id/complete", async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user has already completed it
    const alreadyCompleted = task.completedBy.includes(req.userId);

    if (!alreadyCompleted) {
      // Add user ID to completedBy
      task.completedBy.push(req.userId);
      await task.save();
    }

    res.status(200).json({ message: alreadyCompleted ? "Already completed" : "Marked as completed", task });
  } catch (error) {
    console.error("Error marking task as completed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
