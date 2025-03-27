// frontend/src/services/userService.ts
import api from './api';
import { User } from '@/models/user';

interface Credentials {
    username: string;
    password: string;
}

export const userService = {
    register: (userData: User): Promise<any> => 
        api.post('/api/user/register', userData),
    
    login: (credentials: Credentials): Promise<any> => 
        api.post('/api/user/login', credentials),
    
    getProfile: (): Promise<any> => 
        api.get('/api/user/profile'),
};
