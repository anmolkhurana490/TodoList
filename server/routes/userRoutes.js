import express from 'express';
import { loginUser, registerUser, getUserProfile, logoutUser, getAllUsers, oauthloginUser } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// Get user profile route
router.get('/profile', authMiddleware, getUserProfile);

// User logout route
router.get('/logout', authMiddleware, logoutUser);

// Get all users route (for team management)
router.get('/all', authMiddleware, getAllUsers);

// OAuth Login Route
router.post('/oauth', oauthloginUser);

export default router;