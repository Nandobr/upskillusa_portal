import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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

const YOUTUBE_ID = "9dsgplJK-mo";

export default function DemoPage() {
  return (
    <>
      <section className="demo-page-section">
        <div className="section-inner demo-page-inner">
          <div>
            <div className="demo-page-label">Guided Demo</div>
            <h1>See UpSkill USA in action.</h1>
            <p>
              A walkthrough of the four steps: Inspiration, Education, Seminar, and
              Implementation.
            </p>
          </div>

          <div className="demo-video-card">
            <div className="demo-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
                title="UpSkill USA Product Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="demo-cta-section">
        <div className="section-inner">
          <div className="demo-audit-cta">
            <span className="demo-audit-label">
              <Sparkles size={13} aria-hidden />
              Free Audit
            </span>
            <h2>Ready to see your own audit?</h2>
            <p>Get a tailored AI deployment plan for your enterprise in minutes.</p>
            <Link className="button blue" href="/implement">
              Get Your Free Audit Now
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
