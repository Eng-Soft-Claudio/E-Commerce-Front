// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce", 
  description: "O melhor E-Commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow bg-white text-black">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}