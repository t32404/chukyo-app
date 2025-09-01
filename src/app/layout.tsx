import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "text-app",
  description: "写真を地図に貼り付けるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}>
        {children}
      </body>
    </html>
  );
}