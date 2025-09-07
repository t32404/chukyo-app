"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import CommentOverlay from "../../components/CommentOverlay";

// SSRを無効にしてLeafletマップを動的インポート
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function MapSelectPage() {
    const addCommentRef = useRef<((comment: string) => void) | null>(null);

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

    // グローバルなaddComment関数をwindowオブジェクトに追加
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as unknown as { addComment: (comment: string) => void }).addComment = (comment: string) => {
                if (addCommentRef.current) {
                    addCommentRef.current(comment);
                }
            };
        }
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
            <MapContainer center={[35.681236, 139.767125]} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                />
                <MapPin />
            </MapContainer>

            {/* コメントオーバーレイ */}
            <CommentOverlay
                onAddCommentRef={(addCommentFn) => {
                    addCommentRef.current = addCommentFn;
                }}
            />

            {/* テスト用のコメント追加ボタン */}
            <div className="absolute top-4 left-4 space-y-2" style={{ zIndex: 10000 }}>
                <button
                    onClick={() => addCommentRef.current?.("こんにちは！")}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 block"
                >
                    コメント1
                </button>
                <button
                    onClick={() => addCommentRef.current?.("ニコニコ動画みたい！")}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 block"
                >
                    コメント2
                </button>
                <button onClick={() => addCommentRef.current?.("すごいね〜")} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 block">
                    コメント3
                </button>
            </div>
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

        moveend: (e) => {
            console.log("map moveend:", e);

            // 地図の境界を取得
            const bounds = map.getBounds();
            const center = map.getCenter();

            // 画面右上の緯度経度
            const topRight = bounds.getNorthEast();
            console.log("画面右上の緯度経度:", topRight.lat, topRight.lng);

            // 画面左下の緯度経度
            const bottomLeft = bounds.getSouthWest();
            console.log("画面左下の緯度経度:", bottomLeft.lat, bottomLeft.lng);

            // 中央の緯度経度
            console.log("中央の緯度経度:", center.lat, center.lng);
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
