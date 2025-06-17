// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Copos de Metal", 
  description: "A sua loja de Copos Térmicos de rock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <Header />
        <main className="flex-grow bg-white text-black">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}