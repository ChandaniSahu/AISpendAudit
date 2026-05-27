import "./globals.css";

export const metadata = {
  title: "AI Spend Audit",
  icons: {
    icon: "/favicon.png",
  },
  description: "Optimize your AI spending",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
