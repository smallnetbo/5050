import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agenda 50/50 | Nuevo pacto fiscal y autonómico",
  description: "Portal oficial de socialización, transparencia y monitoreo de la Agenda 50/50.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

