import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          あなたの写真が、<br className="sm:hidden" />街になる。
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          写真を撮って、その場所に世界にひとつだけのオリジナル地図を作ろう。
          みんなが作った地図も見られるよ。
        </p>
      </div>

      {/* コンセプトイメージのイラスト */}
      <div className="mb-12 w-full max-w-lg">
        <Image
          src="/images/concept-art.png"
          alt="アプリのコンセプトアート"
          width={500}
          height={300}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm px-4">
        <Link href="/map/select" className="w-full">
          <button className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition-colors transform hover:scale-105">
            新しい地図を作る
          </button>
        </Link>
        <Link href="/map" className="w-full">
          <button className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-300 transition-colors transform hover:scale-105">
            みんなの地図を見る
          </button>
        </Link>
      </div>
    </div>
  );
}