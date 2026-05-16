import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RaceMate AI — F1 Co-Pilot Operating System",
  description: "Futuristic Formula 1 AI Co-Pilot powered by IBM Granite + Langflow",
  themeColor: "#03030a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
