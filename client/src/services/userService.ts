import API from '../api/index';
import { AxiosResponse } from 'axios';
import {  User } from '../models/responses';

class UserService {
   static async getAllUsers(): Promise<AxiosResponse<User[]>> {
        return API.get('/users')

    }
}

export default UserService;