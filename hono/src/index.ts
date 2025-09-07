import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { AuthService } from './services/auth.js';
import { PinService } from './services/pin.js';

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
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ユーザー登録API
app.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ status: 'Error', message: 'ユーザー名とパスワードは必須です' }, 400);
    }

    const existingUser = await AuthService.getUserByUsername(username);
    if (existingUser) {
      return c.json({ status: 'Error', message: 'このユーザー名は既に使用されています' }, 400);
    }

    await AuthService.register(username, password);
    return c.json({ status: 'OK' });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ status: 'Error', message: '登録中にエラーが発生しました' }, 500);
  }
});

// ログインAPI
app.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ status: 'Error', message: 'ユーザー名とパスワードは必須です' }, 400);
    }

    const user = await AuthService.validateUser(username, password);
    if (!user) {
      return c.json({ status: 'Error', message: 'ユーザー名またはパスワードが正しくありません' }, 401);
    }

    const token = AuthService.generateToken(user.id, user.username);
    return c.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ status: 'Error', message: 'ログイン中にエラーが発生しました' }, 500);
  }
});

// 認証ミドルウェア
async function authenticate(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ status: 'Error', message: '認証が必要です' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const payload = AuthService.verifyToken(token);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ status: 'Error', message: '無効なトークンです' }, 401);
  }
}

// 思い出登録API
app.post('/memories', authenticate, async (c) => {
  try {
    const { lat, lng, content } = await c.req.json();
    const user = c.get('user');

    if (!lat || !lng || !content) {
      return c.json({ status: 'Error', message: '緯度、経度、コンテンツは必須です' }, 400);
    }

    await PinService.createMemory(user.userId, lat, lng, content);
    return c.json({ status: 'OK' });
  } catch (error) {
    console.error('Pin creation error:', error);
    return c.json({ status: 'Error', message: 'ピンの作成中にエラーが発生しました' }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 3030,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app