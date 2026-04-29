import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompeteOps",
  description: "Evidence-grounded competitive intelligence battlecards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}
