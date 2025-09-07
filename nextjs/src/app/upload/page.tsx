"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UploadPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [textContent, setTextContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    const uploadURL = "http://localhost:3030/memories"; // アップロード先のURL

    useEffect(() => {
        if (!lat || !lng) {
            router.push("/map/select");
            return;
        }
    }, [lat, lng, router]);

    const upload = async () => {
        if (!textContent || !lat || !lng) {
            setError("テキストまたは位置情報がありません。");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch(uploadURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("loginToken") || ""}`,
                },
                body: JSON.stringify({
                    ido: 35.681236,
                    keido: 139.767125,
                    content: "東京駅での思い出",
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError("認証エラーです。再度ログインしてください。");
                    router.push("/login");
                    return;
                }
                throw new Error("サーバーエラーが発生しました。");
            }

            const data = await response.json();
            console.log("投稿成功:", data);
            router.push("/map");
        } catch (error: unknown) {
            console.error("投稿に失敗しました:", error);
            setError("投稿に失敗しました。サーバーが起動しているか確認してください。");
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            {isProcessing ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">投稿中...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full max-w-lg">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">思い出をシェアしよう</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        位置: {lat}, {lng}
                    </p>
                    <div className="w-full mb-6">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            コメント
                        </label>
                        <textarea
                            id="comment"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="この場所での思い出や感想を書いてください..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            rows={6}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">{textContent.length}/500文字</p>
                    </div>
                    <button
                        onClick={upload}
                        disabled={!textContent.trim() || isProcessing}
                        className="w-full px-6 py-3 font-bold text-white transition-colors bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? "投稿中..." : "投稿する"}
                    </button>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                </div>
            )}
        </div>
    );
}
