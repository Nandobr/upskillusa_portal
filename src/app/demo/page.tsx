import type { Metadata } from "next";
import { DemoPageContent } from "@/components/demo-page-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Product Demo — UpSkill USA",
  description:
    "Watch a guided walkthrough of the UpSkill USA path from inspiration and learning to action planning and implementation.",
  path: "/demo",
});

export default function DemoPage() {
  return <DemoPageContent />;
}
