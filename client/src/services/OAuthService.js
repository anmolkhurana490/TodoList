import { createAuth0Client } from '@auth0/auth0-spa-js';
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class OAuthService {
    async init() {
        this.auth0Client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            authorizationParams: {
                redirect_uri: window.location.origin,
            },
            cacheLocation: 'localstorage',
        });
    }

    async login(connection) {
        try {
            await this.auth0Client.loginWithPopup({
                connection,
                authorizationParams: {
                    scope: 'openid profile email https://www.googleapis.com/auth/calendar offline_access'
                }
            });

            const user = await this.auth0Client.getUser();
            const access_token = await this.auth0Client.getTokenSilently();

            return { user, token: access_token };
        }
        catch (error) {
            console.error("OAuth login failed:", error);
            return { user: null, token: null };
        }
    }

    async logout() {
        await this.auth0Client.logout({ returnTo: window.location.origin });
    }
}

export const OAuthAPI = async (token) => {
    try {
        const response = await axios.post(`${apiURL}/users/oauth`, { token }, { withCredentials: true });
        return response.data.user;
    } catch (error) {
        console.error("OAuth login failed:", error.message);
        return null;
    }
}