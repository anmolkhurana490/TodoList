import User from '../models/UserModel.js';
import { setTokenCookie, clearTokenCookie, verifyOAuthUser, getAccessIdentity } from '../utils/authUtils.js';
import axios from 'axios';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) return res.status(400).json({ message: 'Email and password are required' });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Successful registration
        const user = { userId: newUser._id, name: newUser.name, email: newUser.email };
        setTokenCookie(res, user);

        return res.status(201).json({ message: 'User registered successfully', user });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error: error.message });
    }
}

// Login an existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        // Check if user exists
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(400).json({ message: 'User not found' });

        // Check password
        const isMatch = await foundUser.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Successful login
        const user = { userId: foundUser._id, name: foundUser.name, email: foundUser.email };
        setTokenCookie(res, user);

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error: error.message });
    }
}

// Get user profile
export const getUserProfile = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = { userId: req.user._id, name: req.user.name, email: req.user.email };
    return res.status(200).json({ user });
}

// Logout a user
export const logoutUser = async (req, res) => {
    try {
        clearTokenCookie(res);
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error: error.message });
    }
}

// OAuth Login User
export const oauthloginUser = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: 'Token is required' });

        const userinfo = await verifyOAuthUser(token);
        if (!userinfo) return res.status(400).json({ message: 'Invalid OAuth token' });

        let user = await User.findOne({ email: userinfo.email });

        // If user does not exist, create new user
        if (!user) user = new User({ name: userinfo.name, email: userinfo.email, password: Math.random().toString(36).slice(-8) });

        // Link OAuth info (provider and access token)
        // Currently, we assume it only supports Google OAuth
        const idp = await getAccessIdentity(userinfo.sub);
        user.oauth_provider = idp.provider;
        user.oauth_access_token = idp.access_token;

        console.log(idp.access_token)

        await user.save();

        const userData = { userId: user._id, name: user.name, email: user.email };
        setTokenCookie(res, userData);

        return res.status(200).json({ message: 'OAuth login successful', user: userData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error: error.message });
    }
}