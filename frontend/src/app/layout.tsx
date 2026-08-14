import type { Metadata } from "next";
import "./globals.css";
import { RouteProvider } from "@/context/RouteContext";
import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <RouteProvider>
            <AppShell>
              {children}
            </AppShell>
          </RouteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
