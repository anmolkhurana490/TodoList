import Task from '../models/TaskModel.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({ message: 'Title and Due Date are required' });
        }

        const newTask = new Task({ title, description, dueDate });
        const savedTask = await newTask.save();


        res.status(201).json({ ...savedTask._doc, id: savedTask._id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

// Get all tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks.map(task => ({ ...task._doc, id: task._id })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Update a task by ID
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ ...updatedTask._doc, id: updatedTask._id });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
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
        res.status(500).json({ message: 'Error deleting task', error });
    }
};