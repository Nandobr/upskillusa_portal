import type { Metadata } from "next";
import { FrameworkPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Learn — Free AI Courses | UpSkill USA",
  description:
    "Choose your audience, goal, and AI tool to get a practical learning path plus recommended free AI courses.",
  path: "/learn",
});

export default function Page() {
  return <FrameworkPage keyName="learn" />;
}
