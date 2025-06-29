import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UPSC Room Hunt | Find Your Perfect Study Room",
  description: "Discover and book the best study rooms for UPSC preparation. Filter by amenities, location, and more.",
  keywords: "UPSC, study rooms, room hunt, book study room, UPSC preparation, study space",
  openGraph: {
    title: "UPSC Room Hunt",
    description: "Find and book the best study rooms for UPSC aspirants.",
    url: "https://your-domain.com",
    type: "website",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UPSC Room Hunt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSC Room Hunt",
    description: "Find and book the best study rooms for UPSC aspirants.",
    images: ["https://your-domain.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
