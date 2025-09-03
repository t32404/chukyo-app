import type { JWTPayload } from "hono/utils/jwt/types";
import { z } from "zod";

export const LoginRequest = z.object({
  username: z.string(),
  password: z.string()
});

export type User = z.infer<typeof LoginRequest>;

export interface Token extends JWTPayload {
  sub: string;
  exp: number;
}