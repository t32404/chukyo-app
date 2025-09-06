import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS設定（Next.jsからのアクセスを許可）
app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowHeaders: ['Content-Type'],
  allowMethods: ['POST', 'GET'], // GETも許可
}));

// 建物の型定義
interface Building {
  id: string;
  imageUrl: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

// ダミーの建物データを保存する配列
const buildings: Building[] = [];

/**
 * @description
 * **フロントエンドの人へ：**
 * このエンドポイントは、写真データと位置情報を受け付け、建物を生成します。
 * - `body`で`imageData`（Base64形式）、`latitude`、`longitude`を受け取ります。
 * - 成功したら、以下の形式のJSONを返してください。
 * - `building.id`: 一意のID
 * - `building.imageUrl`: 生成された建物の画像URL（例：`/images/generated-1.png`）
 * - `building.name`: 建物の名前
 * - `building.latitude`: 緯度
 * - `building.longitude`: 経度
 */
app.post('/api/buildings', async (c) => {
  try {
    const { imageData, latitude, longitude } = await c.req.json();

    // TODO: ここに画像解析と建物生成のロジックを実装してください。
    // 例：画像データ（imageData）を解析し、その特徴に基づいてイラストを生成する。
    // 例：画像をサーバーに保存し、URLを返す。

    const generatedBuilding: Building = {
      id: Math.random().toString(36).substring(7),
      imageUrl: '/images/generated-building.png', // ★ この部分を実際の生成画像URLに置き換えてください
      name: '新しく建てられた建物',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      createdAt: new Date().toISOString(),
    };

    buildings.push(generatedBuilding);

    return c.json({
      message: 'Building created successfully!',
      building: generatedBuilding,
    }, 201);

  } catch (error) {
    console.error('APIエラー:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

/**
 * @description
 * **フロントエンドの人へ：**
 * このエンドポイントは、保存されているすべての建物のリストを返します。
 * - 地図にマーカーをプロットするために使用されます。
 * - 成功したら、以下の形式のJSONを返してください。
 */
app.get('/api/buildings', (c) => {
  return c.json({ buildings });
});

// サーバー起動
serve({
  fetch: app.fetch,
  port: 8787,
});

console.log('Honoサーバーがポート 8787 で起動しました。');