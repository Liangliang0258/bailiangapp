import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "佰亮的AI百宝箱 - AI创作的小工具和小游戏",
  description: "用AI创造有趣的小工具和小游戏，个人作品集展示。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
