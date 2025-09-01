// src/components/DynamicMap.tsx
'use client'; // use client ディレクティブを追加

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import { useRouter } from 'next/navigation'; // useRouterをインポート

// 地図のクリックイベントを処理するコンポーネント
function MapClickEventHandler({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function DynamicMap({ setSelectedPosition, selectedPosition }: { setSelectedPosition: (pos: [number, number]) => void, selectedPosition: [number, number] | null }) {
  const router = useRouter(); // useRouterを初期化

  const handleAddPhoto = () => {
    if (selectedPosition) {
      // 選択された位置情報を持って/uploadページへ遷移
      router.push(`/upload?lat=${selectedPosition[0]}&lng=${selectedPosition[1]}`);
    }
  };

  return (
    <MapContainer
      center={[36.2048, 138.2529]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
      />
      <MapClickEventHandler setPosition={setSelectedPosition} />
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>
            <div className="text-center">
              <p className="mb-2">この場所に写真を追加しますか？</p>
              <button
                onClick={handleAddPhoto}
                className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full hover:bg-blue-600 transition-colors text-sm"
              >
                写真を追加する
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}