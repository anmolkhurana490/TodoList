import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = '1h';

// Function to generate JWT
export const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

// Function to verify JWT
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};

// Helper function to set token cookie
export const setTokenCookie = (res, user) => {
    // Generate token
    const token = generateToken(user);

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: process.env.NODE_ENV === 'PROD' ? 'none' : 'lax',
        path: '/',
    });
}

// Helper function to clear token cookie
export const clearTokenCookie = (res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        sameSite: process.env.NODE_ENV === 'PROD' ? 'none' : 'lax',
        path: '/',
    });
}