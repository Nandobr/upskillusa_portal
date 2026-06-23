import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { appMetadata, createPageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appMetadata.siteUrl),
  ...createPageMetadata({
    title: "UpSkill USA — AI Upskilling Portal",
    description:
      "Find a practical path to use AI without replacing people: Inspire, Learn, Seminar, and Implement.",
    path: "/",
  }),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
