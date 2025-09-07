"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authEndpoint = "http://localhost:3030/login";

    const router = useRouter();

    // ログイン済みの場合はマップページにリダイレクト
    useEffect(() => {
        const token = localStorage.getItem("loginToken");
        if (token) {
            router.push("/map");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!username || !password) {
            setError("ユーザー名とパスワードを入力してください。");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(authEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "ログインに失敗しました。");
            }

            if (!data.token) {
                throw new Error("トークンの取得に失敗しました。");
            }

            // トークンを安全に保存
            localStorage.setItem("loginToken", data.token);
            
            // マップページに遷移
            router.replace("/map");
        } catch (error) {
            console.error("Login error:", error);
            setError(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-black-800">ログイン</h1>
                {error && <p className="mb-4 text-center text-red-500 font-medium">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-black-700 mb-1">
                            ユーザー名
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="username"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black-700 mb-1">
                            パスワード
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="current-password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "ログイン中..." : "ログイン"}
                    </button>
                </form>
            </div>
        </div>
    );
}
