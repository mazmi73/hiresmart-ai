export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  email: string;
  role: Role;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}
