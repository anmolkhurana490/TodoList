import axios from "axios";
import UserModel from "../models/UserModel.js";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const taskAPI = {
    registerUserApi: async (task) => {
        try {
            const response = await axios.post(`${apiURL}/users/register`, task, { withCredentials: true });
            return response.data.user;
        } catch (error) {
            console.error("Error registering user:", error.response.data);
            return null;
        }
    },

    loginUserApi: async (credentials) => {
        try {
            const response = await axios.post(`${apiURL}/users/login`, credentials, { withCredentials: true });
            return response.data.user;
        } catch (error) {
            console.error("Error logging in:", error.response.data);
            return null;
        }
    },

    getUserProfileApi: async (id) => {
        try {
            const response = await axios.get(`${apiURL}/users/profile`, { withCredentials: true });
            return response.data.user;
        } catch (error) {
            console.error("Error fetching profile:", error.response.data);
            return null;
        }
    },

    logoutUserApi: async () => {
        try {
            await axios.get(`${apiURL}/users/logout`, { withCredentials: true });
            return true;
        } catch (error) {
            console.error("Error logging out:", error.response.data);
            return false;
        }
    },

    getAllUsersApi: async () => {
        try {
            const response = await axios.get(`${apiURL}/users/all`, { withCredentials: true });
            return response.data.users;
        } catch (error) {
            console.error("Error fetching users:", error.response.data);
            return [];
        }
    }
};

export default taskAPI;