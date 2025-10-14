import axios from './axios.js';

export const login = async (loginUser) => {
    try {
        const response = await axios.post('/auth/login', loginUser);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export const registerUser = async (registerUser) => {
    try {
        const response = await axios.post('/auth/register', registerUser);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}