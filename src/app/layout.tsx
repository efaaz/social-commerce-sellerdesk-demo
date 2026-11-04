import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Dancing_Script, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cursive",
});
import { Toaster } from "sonner";
// The stylesheet is handled by Next.js at build time and has no TypeScript module declaration.
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "SellerDesk — Simple seller workspace",
  description:
    "A lightweight order and inventory management demo for small social-commerce sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
