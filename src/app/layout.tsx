import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapi - AI Assistant",
  description: "Tu asistente inteligente personalizado con IA",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mapi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
