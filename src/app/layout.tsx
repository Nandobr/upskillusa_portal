import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpSkill USA | One Portal. Four Frameworks.",
  description:
    "A public MVP portal for the UpSkill USA four-framework journey: Inspire, Learn, Adapt, and Implement.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
