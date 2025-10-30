import Task from '../models/TaskModel.js';
import { addTaskToCalender, updateTaskToCalender } from '../utils/googleApiUtils.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({ message: 'Title and Due Date are required' });
        }

        const newTask = new Task({ title, description, dueDate, userId: req.user._id });

        // Add Task to Google Calendar if Google OAuth is used
        // if (req.user.oauth_provider.includes('google')) {
        //     const calenderEvent = await addTaskToCalender(newTask, req.user.oauth_access_token);
        //     newTask.googlEventId = calenderEvent.id;
        // }

        const savedTask = await newTask.save();

        res.status(201).json({ ...savedTask._doc, id: savedTask._id });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Get all tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks.map(task => ({ ...task._doc, id: task._id })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Update a task by ID
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!updateTask) return res.status(404).json({ message: 'Task not found' });

        // Update Task in Google Calendar if Google OAuth is used
        // if (updateTask.googlEventId && req.user.oAuth_sub.includes('google')) {
        //     await updateTaskToCalender(updateTask._doc, req.user.accessToken);
        // }

        res.status(200).json({ ...updatedTask._doc, id: updatedTask._id });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};