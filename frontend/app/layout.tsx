import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import HeaderWrapper  from "@/components/Header/HeaderWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planly",
  description: "AI-powered FloorPlan Generator",
  icons: {
      icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-full flex flex-col">
          <HeaderWrapper />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}