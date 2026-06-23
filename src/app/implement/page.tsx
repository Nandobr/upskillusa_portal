import type { Metadata } from "next";
import { FrameworkPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Implement — Launch a First AI Pilot | UpSkill USA",
  description:
    "Map business or employee workflows, estimate AI value, add human review, and choose a first pilot.",
  path: "/implement",
});

export default function Page() {
  return <FrameworkPage keyName="implement" />;
}
