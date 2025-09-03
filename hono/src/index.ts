import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { AuthService } from './auth.js';
import { LoginRequest } from './schema.js';

const app = new Hono()


const TOKEN_EXPIRATION_MINUTES = 5;
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
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app