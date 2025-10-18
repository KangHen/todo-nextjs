import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - Manage Your Tasks Efficiently",
  description: "A modern todo application built with Next.js, TypeScript, and Tailwind CSS",
  keywords: ["Todo", "Task Management", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Todo App Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Todo App",
    description: "Manage your tasks efficiently with our modern todo application",
    url: "https://chat.z.ai",
    siteName: "Todo App",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo App",
    description: "Manage your tasks efficiently with our modern todo application",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
