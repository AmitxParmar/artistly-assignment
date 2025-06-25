import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./../provider/QueryProvider";
import Nav from "@/components/common/Nav";
import NextThemeProvider from "@/provider/NextThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artistly - Performing Artist Booking Platform",
  description: "Connect event planners with talented performing artists",
  keywords: "artist booking, event planning, performers, entertainment",
  openGraph: {
    title: "Artistly - Artist Booking Platform",
    description: "Find and book talented performing artists for your events",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemeProvider>
          <div className="min-h-screen bg-background">
            <QueryProvider>
              <Nav />
              {children}
              <Toaster />
            </QueryProvider>
          </div>
        </NextThemeProvider>
      </body>
    </html>
  );
}
