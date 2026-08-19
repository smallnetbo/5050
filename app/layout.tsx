import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={
 title:"Agenda 50/50 | Nuevo pacto fiscal y autonómico",
 description:"Portal oficial de socialización, transparencia y monitoreo de la Agenda 50/50."
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
