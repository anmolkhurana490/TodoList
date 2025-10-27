import axios from "axios";
import TaskModel from "../models/TaskModel.js";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const taskAPI = {
    createTaskApi: async (task) => {
        try {
            const response = await axios.post(`${apiURL}/tasks`, task);
            return response.data;
        } catch (error) {
            console.error("Error creating task:", error.response.data);
            return null;
        }
    },

    getTasksApi: async () => {
        try {
            const response = await axios.get(`${apiURL}/tasks`);
            return response.data;
        } catch (error) {
            console.error("Error fetching tasks:", error.response.data);
            return [];
        }
    },

    updateTaskApi: async (id, updates) => {
        try {
            const response = await axios.put(`${apiURL}/tasks/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error.response.data);
            return null;
        }
    },

    deleteTaskApi: async (id) => {
        try {
            await axios.delete(`${apiURL}/tasks/${id}`);
            return true;
        } catch (error) {
            console.error("Error deleting task:", error.response.data);
            return false;
        }
    }
};

export default taskAPI;