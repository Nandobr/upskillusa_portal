import type { Metadata } from "next";
import { FrameworkPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Imagine — Find Your Direction | UpSkill USA",
  description:
    "Start with your role and strengths. Discover where AI can support your next career, learning, or work move.",
  path: "/inspire",
});

export default function Page() {
  return <FrameworkPage keyName="inspire" />;
}
