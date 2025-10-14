import type { LoginResponse, LoginUser, RegisterUser } from '../types/auth.dto';
import axios from './axios';

export const login = async (loginUser: LoginUser) => {
    try {
        const response = await axios.post<LoginResponse>('/auth/login', loginUser);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export const registerUser = async (registerUser: RegisterUser) => {
    try {
        const response = await axios.post<LoginResponse>('/auth/register', registerUser);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}