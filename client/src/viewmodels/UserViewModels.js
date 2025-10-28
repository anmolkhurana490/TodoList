import { useState, useEffect } from "react";
import UserAPI from "../services/UserAPI";
import { useNavigate } from "react-router-dom";

const useUserViewModel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { registerUserApi, loginUserApi, getUserProfileApi, logoutUserApi } = UserAPI;

    useEffect(() => {
        if (user) navigate('/todos');
        else navigate('/auth');
    }, [user]);

    const registerUser = async (userData) => {
        setLoading(true);
        try {
            const newUser = await registerUserApi(userData);
            setUser(newUser);
        } catch (error) {
            console.error("Failed to register user:", error);
        }
        setLoading(false);
    };

    const loginUser = async (credentials) => {
        setLoading(true);
        try {
            const loggedInUser = await loginUserApi(credentials);
            setUser(loggedInUser);
        } catch (error) {
            console.error("Failed to login user:", error);
        }
        setLoading(false);
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const profile = await getUserProfileApi();
            setUser(profile);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const logoutUser = async () => {
        setLoading(true);
        try {
            if (confirm("Are you sure you want to logout?")) {
                const success = await logoutUserApi();
                if (success) setUser(null);
            }
        } catch (error) {
            console.error("Failed to logout user:", error);
        }
        setLoading(false);
    };

    return {
        user, loading,
        registerUser, loginUser, fetchUserProfile, logoutUser
    };
}

export default useUserViewModel;