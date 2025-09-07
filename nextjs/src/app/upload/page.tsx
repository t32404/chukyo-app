"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function UploadPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const photoRef = useRef<HTMLCanvasElement>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    useEffect(() => {
        if (!lat || !lng) {
            router.push("/map/select");
            return;
        }

        async function initCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("カメラへのアクセスに失敗しました: ", err);
                setError("カメラへのアクセスに失敗しました。");
            }
        }
        initCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [lat, lng, router]); // ★ 依存配列から stream を削除

    const takePhoto = () => {
        const video = videoRef.current;
        const photoCanvas = photoRef.current;

        if (video && photoCanvas) {
            photoCanvas.width = video.videoWidth;
            photoCanvas.height = video.videoHeight;
            const context = photoCanvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
                const imageData = photoCanvas.toDataURL("image/png");
                setPhoto(imageData);
            }
        }
    };

    const uploadPhoto = async () => {
        if (!photo || !lat || !lng) {
            setError("画像または位置情報がありません。");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8787/api/buildings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageData: photo,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lng),
                }),
            });

            if (!response.ok) {
                throw new Error("サーバーエラーが発生しました。");
            }

            const data = await response.json();
            router.push("/map");
        } catch (error: any) {
            console.error("アップロードに失敗しました:", error);
            setError("アップロードに失敗しました。サーバーが起動しているか確認してください。");
            setIsProcessing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            {isProcessing ? (
                <div className="flex flex-col items-center">
                    <Image src="/images/loading-animation.gif" alt="生成中" width={200} height={200} />
                    <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">写真を解析中...</p>
                </div>
            ) : photo ? (
                <div className="flex flex-col items-center">
                    <Image src={photo} alt="撮影した写真" width={300} height={300} className="rounded-lg shadow-lg" />
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => setPhoto(null)}
                            className="px-6 py-3 font-bold text-gray-800 transition-colors bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
                        >
                            撮り直す
                        </button>
                        <button
                            onClick={uploadPhoto}
                            className="px-6 py-3 font-bold text-white transition-colors bg-blue-500 rounded-full shadow-md hover:bg-blue-600"
                        >
                            この場所へ貼り付ける
                        </button>
                    </div>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                </div>
            ) : (
                <div className="flex flex-col items-center w-full max-w-lg">
                    <p className="text-lg mb-4 text-gray-800 dark:text-gray-200">写真を撮影または選択してください</p>
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                        <video ref={videoRef} autoPlay className="absolute inset-0 w-full h-full object-cover"></video>
                    </div>
                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 mt-8 bg-blue-500 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
                        aria-label="写真を撮る"
                    >
                        <div className="w-16 h-16 bg-white rounded-full border-4 border-blue-500"></div>
                    </button>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">または</p>
                    <input type="file" accept="image/*" className="hidden" id="file-input" onChange={handleFileChange} />
                    <label htmlFor="file-input" className="mt-2 text-blue-500 cursor-pointer hover:underline">
                        写真ライブラリから選択
                    </label>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                </div>
            )}
            <canvas ref={photoRef} className="hidden"></canvas>
        </div>
    );
}
