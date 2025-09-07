"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [userid, setUserid] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const authEndpoint = "http://localhost:3030/token";

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!userid || !password) {
            setError("ユーザーIDとパスワードを入力してください。");
            return;
        }

        try {
            const response = await fetch(authEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: userid, password }),
            });

            if (!response.ok) {
                throw new Error("ログインに失敗しました。ユーザーIDまたはパスワードが正しくありません。");
            }

            const data = await response.json();

            if (!data.token) {
                throw new Error("ログインに失敗しました。トークンの取得ができません。");
            }

            console.log("ログイン成功:", data);
            alert("ログイン成功！");
            // ログイン成功後の処理をここに追加
            window.localStorage.setItem("loginToken", data.token);
            router.push("/map");
        } catch (error) {
            setError(error instanceof Error ? error.message : "予期しないエラーが発生しました。");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-black-800">ログイン</h1>
                {error && <p className="mb-4 text-center text-red-500 font-medium">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="userid" className="block text-sm font-medium text-black-700 mb-1">
                            ユーザーID
                        </label>
                        <input
                            type="text"
                            id="userid"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="username"
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
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}
