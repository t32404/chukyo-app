'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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

// MapContainerと関連コンポーネントを動的にインポート
const DynamicMap = dynamic(
  () => import('@/components/DynamicMap'),
  { ssr: false }
);

export default function MapSelectPage() {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  const handleConfirmLocation = () => {
    if (selectedPosition) {
      router.push(`/upload?lat=${selectedPosition[0]}&lng=${selectedPosition[1]}`);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <DynamicMap setSelectedPosition={setSelectedPosition} selectedPosition={selectedPosition} />
      {selectedPosition && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-white rounded-lg shadow-lg z-50 text-center">
          <p className="text-sm font-semibold mb-2">選択された位置:<br/> {selectedPosition[0].toFixed(4)}, {selectedPosition[1].toFixed(4)}</p>
          <button
            onClick={handleConfirmLocation}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            この場所で建物を建てる
          </button>
        </div>
      )}
    </div>
  );
}