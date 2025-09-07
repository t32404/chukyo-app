export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface Pin {
  id: number;
  userid: number;
  ido: number;
  keido: number;
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

export interface CreatePinRequest {
  ido: number;
  keido: number;
  content: string;
}

export interface ApiResponse {
  status: "OK" | "Error";
  message?: string;
}

export interface PinsResponse extends ApiResponse {
  contents?: string[];
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
}

export interface MapBounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export interface GetPinsQuery {
  latMin: string;
  latMax: string;
  lngMin: string;
  lngMax: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}
