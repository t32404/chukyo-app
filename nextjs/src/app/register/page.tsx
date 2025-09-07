"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RegisterFormData {
    username: string;
    password: string;
    passwordConfirm: string;
}

interface ValidationErrors {
    username?: string;
    password?: string;
    passwordConfirm?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState<RegisterFormData>({
        username: "",
        password: "",
        passwordConfirm: "",
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // ログイン済みの場合はマップページにリダイレクト
    useEffect(() => {
        const token = localStorage.getItem("loginToken");
        if (token) {
            router.push("/map");
        }
    }, [router]);

    // 入力値のバリデーション
    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        if (!formData.username) {
            errors.username = "ユーザー名を入力してください";
        } else if (formData.username.length < 3) {
            errors.username = "ユーザー名は3文字以上で入力してください";
        }

        if (!formData.password) {
            errors.password = "パスワードを入力してください";
        } else if (formData.password.length < 6) {
            errors.password = "パスワードは6文字以上で入力してください";
        }

        if (!formData.passwordConfirm) {
            errors.passwordConfirm = "確認用パスワードを入力してください";
        } else if (formData.password !== formData.passwordConfirm) {
            errors.passwordConfirm = "パスワードが一致しません";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // フォームの送信処理
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // バリデーションチェック
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3030/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "ユーザー登録に失敗しました");
            }

            // 登録成功時はログインページへ
            router.push("/login");
        } catch (error) {
            console.error("Registration error:", error);
            setError(error instanceof Error ? error.message : "予期しないエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    // 入力値の更新
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // 入力時にエラーをクリア
        setValidationErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    ユーザー登録
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            ユーザー名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                            autoComplete="username"
                        />
                        {validationErrors.username && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            パスワード
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {validationErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                            パスワード（確認）
                        </label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {validationErrors.passwordConfirm && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.passwordConfirm}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "登録中..." : "登録"}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        すでにアカウントをお持ちの方は
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-1">
                            こちらからログイン
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
