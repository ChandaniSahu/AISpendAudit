import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit - Stop Overpaying for AI Tools",
  description:
    "Analyze your AI stack and discover cheaper plans, better alternatives, and hidden savings opportunities instantly. Save up to 50% on AI subscriptions.",
  keywords:
    "AI tools, cost optimization, AI spending, subscription audit, save money, AI budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
