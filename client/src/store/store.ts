import { AuthResponse, User } from "../models/responses";
import {makeAutoObservable} from "mobx"; 
import AuthService from "../services/authService";
import axios from "axios";
import { API_URL } from "../api";

export default class Store {
   user = {} as User
   isAuth = false;
   isLoading = false;

   constructor() {
      makeAutoObservable(this)
   }

   setAuth(isAuth: boolean) {
      this.isAuth = isAuth;
   }

   setUser(user: User) {
      this.user = user;
   }

   setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading;
   }

   async login(email: string, password: string) {
      try {
         const response = await AuthService.login(email, password);
         localStorage.setItem('accessToken', response.data.accessToken);
         this.setAuth(true);
         this.setUser(response.data.user)
      }  catch (error) {
         console.log(error);
      }
   }

   async registration(email: string, password: string) {
      try {
         const response = await AuthService.registration(email, password);
         localStorage.setItem('accessToken', response.data.accessToken);
         this.setAuth(true);
         this.setUser(response.data.user)
      }  catch (error) {
         console.log(error);
      }
   }

   async logout() {
      try {
         const response = await AuthService.logout();
         localStorage.removeItem('accessToken');
         this.setAuth(false);
         this.setUser({} as User)
      }  catch (error) {
         console.log(error);
      }
   }

   async checkAuth() {
      this.setIsLoading(true);
      try {
         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { 
            withCredentials: true,
          }) 
         this.setAuth(true);
         this.setUser(response.data.user)
         
      }  catch (error) {
         console.log(error);
      } finally {
         this.setIsLoading(false);
      }
   }
}