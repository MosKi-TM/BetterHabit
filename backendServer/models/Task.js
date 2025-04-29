import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional if you want to keep track of task owner
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // optional if the task belongs to a group
  }
});

export default mongoose.model("Task", TaskSchema);
