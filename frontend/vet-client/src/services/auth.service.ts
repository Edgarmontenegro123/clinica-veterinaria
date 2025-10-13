import type { LoginResponse, LoginUser } from '../types/auth.dto';
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