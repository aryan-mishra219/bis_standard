import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "M.A.N.A.K — BIS Standards AI Assistant",
  description:
    "Multilingual AI Assistant for National Accreditation & Knowledge. Verify BIS standards, audit product compliance, and navigate Indian certification.",
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
