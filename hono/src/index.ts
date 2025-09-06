import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';

import { AuthService } from './auth.js';
import { LoginRequest } from './schema.js';

const app = new Hono()

// CORS設定を追加
app.use('/*', cors({
  origin: ['http://localhost:3000'], // Next.jsアプリケーションのオリジン
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true
}))

const TOKEN_EXPIRATION_MINUTES = 525600;
if (!process.env.SECRET) {
  throw new Error("SECRET environment variable is not set.");
}
const SECRET = process.env.SECRET;

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/token", zValidator("json", LoginRequest), async (c) => {
  try {
    const validated = c.req.valid("json");
    const token = await AuthService.login(
      validated.username,
      validated.password
    );
    return c.json({ token: token });
  } catch (e) {
    return c.json({ message: "Invalid username or password" }, 401);
  }
});

serve({
  fetch: app.fetch,
  port: 3030,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app