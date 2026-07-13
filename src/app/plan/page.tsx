import type { Metadata } from "next";
import { PlanPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI-Ready Action Plan — UpSkill USA",
  description:
    "Review the saved outputs from Imagine, Learn, Seminar, and Implement in one AI-Ready Action Plan.",
  path: "/plan",
});

export default function Page() {
  return <PlanPage />;
}
