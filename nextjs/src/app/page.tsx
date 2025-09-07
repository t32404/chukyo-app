import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    あなたの写真が、
                    <br className="sm:hidden" />
                    街になる。
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    写真を撮って、その場所に世界にひとつだけのオリジナル地図を作ろう。 みんなが作った地図も見られるよ。
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl px-4 sm:px-0">
                <Link href="/map" className="w-full">
                    <button className="w-full bg-gray-300 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-400 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 whitespace-nowrap">
                        みんなの地図を見る
                    </button>
                </Link>
            </div>
        </div>
    );
}
