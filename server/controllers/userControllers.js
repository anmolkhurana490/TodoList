import User from '../models/UserModel.js';
import { generateToken } from '../utils/jwtUtils.js';

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
    return res.status(200).json({ user: req.user });
}

// Logout a user
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PROD',
            sameSite: 'lax',
            path: '/',
        });
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error: error.message });
    }
}

// Helper function to set token cookie
const setTokenCookie = (res, user) => {
    // Generate token
    const token = generateToken(user);

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // sameSite: process.env.NODE_ENV === 'PROD' ? 'none' : 'lax',
        sameSite: 'lax',
        path: '/',
    });
}