import { useState, useEffect } from "react";
import UserAPI from "../services/UserAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { OAuthService, OAuthAPI } from "../services/OAuthService";

const useUserViewModel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // JWT Authentication
    const { registerUserApi, loginUserApi, getUserProfileApi, logoutUserApi } = UserAPI;

    useEffect(() => {
        if (user && location.pathname !== '/todos') navigate('/todos');
        else if (!user && location.pathname !== '/auth') navigate('/auth');
    }, [user]);

    const registerUser = async (userData) => {
        setLoading(true);
        try {
            const newUser = await registerUserApi(userData);
            if (newUser) setUser(newUser);
        } catch (error) {
            console.error("Failed to register user:", error);
            setUser(null);
        }
        setLoading(false);
    };

    const loginUser = async (credentials) => {
        setLoading(true);
        try {
            const loggedInUser = await loginUserApi(credentials);
            if (loggedInUser) setUser(loggedInUser);
        } catch (error) {
            console.error("Failed to login user:", error);
            setUser(null);
        }
        setLoading(false);
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const profile = await getUserProfileApi();
            if (profile) setUser(profile);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setUser(null);
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

    // OAuth Authentication
    const [auth0, setAuth0] = useState(null);

    useEffect(() => {
        const initAuth0 = async () => {
            const oauthService = new OAuthService();
            await oauthService.init();
            setAuth0(oauthService);
        }
        initAuth0();
    }, []);

    const OAuthLoginUser = async (provider) => {
        if (!auth0) return;
        setLoading(true);

        const { oauthuser, token } = await auth0.login(provider);

        if (token) {
            const loggedInUser = await OAuthAPI(token);
            if (loggedInUser) setUser(loggedInUser);
        }

        setLoading(false);
    }

    return {
        user, loading,
        registerUser, loginUser, fetchUserProfile, logoutUser,
        OAuthLoginUser
    };
}

export default useUserViewModel;