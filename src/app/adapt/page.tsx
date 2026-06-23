import type { Metadata } from "next";
import { FrameworkPage } from "@/components/portal-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Seminar — Build Your AI-Ready Action Plan | UpSkill USA",
  description:
    "Prepare a worker or business action plan that turns AI learning into workflows, saved time, human review, and next steps.",
  path: "/adapt",
});

export default function Page() {
  return <FrameworkPage keyName="adapt" />;
}
