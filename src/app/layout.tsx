import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ООО «АСУ №7» — Строительно-монтажные работы любой сложности",
  description:
    "ООО «АСУ №7» — Архитектурное строительное управление №7. Облицовка натуральным камнем, монтаж металлоконструкций, витражные конструкции, благоустройство территорий. Опыт работы с объектами Московского метрополитена и гражданского строительства.",
  keywords: [
    "АСУ 7",
    "строительная компания",
    "облицовка камнем",
    "металлоконструкции",
    "благоустройство",
    "Московский метрополитен",
    "натуральный камень",
    "строительство Казань",
  ],
  authors: [{ name: "ООО АСУ №7" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ООО «АСУ №7» — Строительно-монтажные работы любой сложности",
    description:
      "Облицовка натуральным камнем, монтаж металлоконструкций, благоустройство. 19+ реализованных проектов.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
