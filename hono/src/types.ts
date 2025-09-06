export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface Memory {
  id: number;
  user_id: number;
  lat: number;
  lng: number;
  content: string;
  created_at: Date;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateMemoryRequest {
  lat: number;
  lng: number;
  content: string;
}

export interface ApiResponse {
  status: "OK" | "Error";
  message?: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}
