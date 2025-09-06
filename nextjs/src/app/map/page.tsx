'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // この行を追加
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leafletのデフォルトマーカーアイコンを設定
if (typeof window !== 'undefined') {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

interface Building {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  imageUrl?: string;
}

// MapContainerと関連コンポーネントを動的にインポート
const DynamicMap = dynamic(
  () => import('@/components/DynamicMapView'), // 新しいコンポーネントを作成
  { ssr: false }
);

export default function MapPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch('http://localhost:8787/api/buildings');
        const data = await res.json();
        setBuildings(data.buildings || []);
      } catch (error) {
        console.error('建物の取得に失敗しました:', error);
      }
    };
    fetchBuildings();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <DynamicMap buildings={buildings} />
    </div>
  );
}