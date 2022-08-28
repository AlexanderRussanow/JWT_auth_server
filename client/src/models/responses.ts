export interface AuthResponse {
      accessToken: string;
      refreshToken: string;
      user: User;
}

export interface User {
   email: string;
   id: number;
   isActivated: boolean;
}