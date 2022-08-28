import axios from 'axios';
import { AuthResponse } from '../models/responses';

export const API_URL = 'http://localhost:5000/api';

const API = axios.create({
   baseURL: API_URL,
   withCredentials: true

})

API.interceptors.request.use(config => {
   //@ts-ignore
   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
   return config;
})

API.interceptors.response.use(
   response => {
       return response;
   },
   async error => {
       const originalRequest = error.config;
       if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
           try {
               localStorage.removeItem('accessToken');
               const response = await axios.get<AuthResponse>(`${ API_URL }/refresh`, {
                   withCredentials: true,
               });
               localStorage.setItem('accessToken', response.data.accessToken);
               return API.request(originalRequest);
           } catch (error) {
               console.log(error);
           }
       }
         return Promise.reject(error);
   }
);

export default API;