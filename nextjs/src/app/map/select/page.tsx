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
            <MapContainer center={[34.9961, 137.1147]} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
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
                        <div className="p-2 text-center">
                            <p className="text-sm font-semibold mb-2">
                                選択された位置:
                                <br /> {selectedPosition[0].toFixed(4)}, {selectedPosition[1].toFixed(4)}
                            </p>
                            <button
                                onClick={handleConfirmLocation}
                                className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full shadow-md hover:bg-blue-600 transition-colors text-sm"
                            >
                                この場所に建物を建てる
                            </button>
                        </div>
                    </Popup>
                </Marker>
            )}
        </>
    );
}
