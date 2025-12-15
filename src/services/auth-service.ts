import type { UserDto, UserLoginDto } from 'src/types/client'; // Need to define these types

import axios from 'axios';

// ----------------------------------------------------------------------

export const AUTH_API = 'https://localhost:7163/api/Utilisateur';

export const login = async (data: UserLoginDto) => {
    const response = await axios.post(`${AUTH_API}/login`, data);
    const { token, user } = response.data;
    if (token) {
        setSession(token);
    }
    return { token, user };
};

export const register = async (data: UserDto) => {
    const response = await axios.post(`${AUTH_API}/register`, data);
    return response.data;
};

export const logout = () => {
    setSession(null);
};

export const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

export function isValidToken(accessToken: string) {
    if (!accessToken) {
        return false;
    }

    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
}
