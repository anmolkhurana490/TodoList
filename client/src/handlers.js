import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createTask = async (task) => {
    try {
        const response = await axios.post(`${apiURL}/tasks`, task);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error.response.data);
        return null;
    }
};

export const getTasks = async () => {
    try {
        const response = await axios.get(`${apiURL}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error.response.data);
        return [];
    }
};

export const updateTask = async (id, updates) => {
    try {
        const response = await axios.put(`${apiURL}/tasks/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error.response.data);
        return null;
    }
};

export const deleteTask = async (id) => {
    try {
        await axios.delete(`${apiURL}/tasks/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting task:", error.response.data);
        return false;
    }
};