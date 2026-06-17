import type { Metadata } from "next";
import { DemoPageContent } from "@/components/demo-page-content";

export const metadata: Metadata = {
  title: "Product Demo — UpSkill USA",
  description:
    "Watch the UpSkill USA demo: Inspiration, Education, Seminar, and Implementation in action.",
  openGraph: {
    title: "Product Demo — UpSkill USA",
    description:
      "See how UpSkill USA helps people and organizations create value with AI while keeping people in the loop.",
  },
};

export default function DemoPage() {
  return <DemoPageContent />;
}
