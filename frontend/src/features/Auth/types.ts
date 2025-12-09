export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  profile_photo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // If using JWT later
}
