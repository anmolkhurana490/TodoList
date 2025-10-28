import UserModel from '../models/UserModel.js';
import { verifyToken } from '../utils/jwtUtils.js';

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) return res.status(401).json({ message: 'Please Login First' });

        const payload = verifyToken(token);
        if (!payload) return res.status(401).json({ message: 'Invalid Token. Please Login Again' });

        const user = await UserModel.findById(payload.userId);
        if (!user) return res.status(401).json({ message: 'Invalid Token. Please Login Again' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default AuthMiddleware;