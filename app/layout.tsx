import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/app/context/SnackbarContext";
import ClientLayout from "./ClientLayout"; // 👈 important

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PG Thikana",
  description: "Find verified PGs, hostels & flats near you",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          overflowX: "hidden",
          background: "#F0FDF9",
        }}
      >
        <SnackbarProvider>
          <ClientLayout>{children}</ClientLayout>
        </SnackbarProvider>
      </body>
    </html>
  );
}