import express from "express";
import Groups from "../models/Groups.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT Middleware
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

function generateGroupCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
  
// Create group
router.post("/", async (req, res) => {
try {
    const { title, userIds = [], taskIds = [] } = req.body;

    let code;
    let exists = true;
    while (exists) {
    code = generateGroupCode();
    exists = await Groups.exists({ code });
    }

    const group = await Groups.create({
    title,
    code,
    users: [req.userId, ...userIds],
    tasks: taskIds
    });

    res.status(201).json(group);
} catch (err) {
    res.status(500).json({ error: err.message });
}
});
  

// 📌 Add user to group
router.post("/:groupId/add-user", async (req, res) => {
  try {
    const { userId } = req.body;

    const group = await Groups.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { users: userId } },
      { new: true }
    );

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Add task to group
router.post("/:groupId/add-task", async (req, res) => {
  try {
    const { taskId } = req.body;

    const group = await Groups.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { tasks: taskId } },
      { new: true }
    );

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get groups for current user
router.get("/", async (req, res) => {
  try {
    const groups = await Groups.find({ users: req.userId })
      .populate("users", "username")
      .populate("tasks");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a group using code
router.post("/join/:code", async (req, res) => {
    try {
      const group = await Groups.findOne({ code: req.params.code });
      if (!group) return res.status(404).json({ error: "Group not found" });
  
      // Add user if not already added
      if (!group.users.includes(req.userId)) {
        group.users.push(req.userId);
        await group.save();
      }
  
      res.json({ message: "Joined group", group });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Fetch a group by ID and populate tasks
router.get('/:id', async (req, res) => {
    try {
      const group = await Groups.findById(req.params.id).populate('tasks');
      console.log(group);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json(group.tasks); // Send the group with its populated tasks
    } catch (error) {
      console.error('Error fetching group', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

export default router;
