import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { PageShell } from "@/components/page-shell";
import { FirebaseAuthSync } from "@/components/auth/firebase-auth-sync";

export const metadata: Metadata = {
  title: "TourAI - AI Powered Tour Recommender",
  description: "Premium collaborative-filtering travel recommendation app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <FirebaseAuthSync />
          <Navbar />
          <PageShell>{children}</PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
