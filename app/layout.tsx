import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MoneyMetric",
  description: "Personal Finance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<p>Loading dashboard...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
