// src/components/DynamicMapView.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 建物データの型を定義
interface Building {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  imageUrl?: string;
}

// 建物のカスタムアイコンを生成する関数
const createBuildingIcon = (imageUrl: string) => {
  return L.icon({
    iconUrl: imageUrl,
    iconRetinaUrl: imageUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [60, 60],
    shadowAnchor: [30, 60],
    className: 'rounded-full border-2 border-white shadow-md'
  });
};

export default function DynamicMapView({ buildings }: { buildings: Building[] }) {
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
      {buildings.map((building) => (
        <Marker
          key={building.id}
          position={[building.latitude, building.longitude]}
          icon={createBuildingIcon(building.imageUrl || '/images/default-building.png')}
        >
          <Popup>
            <div>
              <h2>{building.name || '無題の建物'}</h2>
              <p>ここは{building.name || '建物'}です。</p>
              {building.imageUrl && (
                <img src={building.imageUrl} alt={building.name} style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}