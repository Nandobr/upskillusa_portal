import type { Metadata } from "next";
import { OverviewPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "UpSkill USA — AI Upskilling Portal",
  description:
    "Find a practical path to use AI without replacing people: Inspire, Learn, Seminar, and Implement.",
  path: "/",
});

export default function Page() {
  return <OverviewPage />;
}
