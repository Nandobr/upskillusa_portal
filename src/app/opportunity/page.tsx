import type { Metadata } from "next";
import { OpportunityPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI Opportunity Audit — UpSkill USA",
  description:
    "Enter a company URL to identify AI-ready workflows, operational gaps, and practical automation opportunities.",
  path: "/opportunity",
});

export default function Page() {
  return <OpportunityPage />;
}
