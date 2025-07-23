import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import Nav from "@/components/nav/nav";
import { ClientProviders } from "@/providers/Providers";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <ClientProviders>
          <Nav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
