import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
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

    const isProduction = process.env.NODE_ENV === 'PROD';

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
}

// Helper function to clear token cookie
export const clearTokenCookie = (res) => {
    const isProduction = process.env.NODE_ENV === 'PROD';

    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
}

// Verify OAuth token
export const verifyOAuthUser = async (token) => {
    try {
        const userinfo = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });

        return userinfo.data;
    } catch (error) {
        // console.error('OAuth token verification failed:', error.message);
        return null;
    }
}

const getAuth0ManagementToken = async () => {
    try {
        const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            JSON.stringify({
                "client_id": process.env.AUTH0_CLIENT_M2M_ID,
                "client_secret": process.env.AUTH0_CLIENT_M2M_SECRET,
                "audience": `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
                "grant_type": "client_credentials"
            }),
            { headers: { 'content-type': 'application/json' } }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Management Token:', error.message);
    }
};


export const getAccessIdentity = async (auth0TokenId) => {
    try {
        const managementToken = await getAuth0ManagementToken();

        const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0TokenId}`,
            {
                headers: {
                    Authorization: `Bearer ${managementToken}`,
                    'content-type': 'application/json'
                }
            }
        );

        return response.data.identities[0];
    } catch (error) {
        console.error('Error fetching Access Token:', error.message);
    }
}