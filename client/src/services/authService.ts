import API from '../api/index';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/responses';

class AuthService {
   static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return API.post('/login', {email, password})

    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return API.post('/register', {email, password});
    }

    static async logout(): Promise<void> {
        return API.post('/logout');
    }

    static async checkAuth(): Promise<AxiosResponse<AuthResponse>> {
        return API.get('/checkAuth');
    }
}

export default AuthService;