"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

// SSRを無効にしてLeafletマップを動的インポート
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function MapSelectPage() {
    useEffect(() => {
        // Leafletのデフォルトアイコンを修正
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                });
            });
        }
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapPin />
            </MapContainer>
        </div>
    );
}

function MapPin() {
    const router = useRouter();

    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

    const handleConfirmLocation = () => {
        if (selectedPosition) {
            router.push(`/upload?lat=${selectedPosition[0]}&lng=${selectedPosition[1]}`);
        }
    };

    const map = useMapEvents({
        // クリック時の動作
        click: (e) => {
            map.locate();
            console.log(e.latlng);
            setSelectedPosition([e.latlng.lat, e.latlng.lng]);
        },

        // 位置情報を取得するところ
        locationfound: (location) => {
            console.log("location found:", location);
        },
    });

    return (
        <>
            {selectedPosition && (
                <Marker position={selectedPosition}>
                    <Popup>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-white rounded-lg shadow-lg z-50 text-center">
                            <p className="text-sm font-semibold mb-2">
                                選択された位置:
                                <br /> {selectedPosition[0].toFixed(4)}, {selectedPosition[1].toFixed(4)}
                            </p>
                            <button
                                onClick={handleConfirmLocation}
                                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                            >
                                この場所で建物を建てる
                            </button>
                        </div>
                    </Popup>
                </Marker>
            )}
        </>
    );
}
