import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "P.R.A.M.A.A.N — BIS Standards & Compliance AI Platform",
  description:
    "Platform for Regulatory And Marking Authenticity Across Nation. Verify BIS standards, audit product compliance, calculate fees, and navigate Indian certification.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)] antialiased bg-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
