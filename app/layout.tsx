import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agenda 50/50 | Nuevo pacto fiscal y autonómico",
  description: "Portal oficial de socialización, transparencia y monitoreo de la Agenda 50/50.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={raleway.variable}>
      <body className={raleway.className}>{children}</body>
    </html>
  );
}

