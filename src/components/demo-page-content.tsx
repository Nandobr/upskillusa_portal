"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePortalContent } from "@/components/language-provider";
import type { Language } from "@/lib/content";

const YOUTUBE_ID = "9dsgplJK-mo";

const demoPageCopy: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    intro: string;
    videoTitle: string;
    auditEyebrow: string;
    auditTitle: string;
    auditBody: string;
    auditCta: string;
  }
> = {
  en: {
    eyebrow: "Guided Demo",
    title: "See UpSkill USA in action.",
    intro: "A walkthrough of the four steps: Imagine, Education, Seminar, and Implementation.",
    videoTitle: "UpSkill USA Product Demo",
    auditEyebrow: "Free Audit",
    auditTitle: "Ready to see your own audit?",
    auditBody: "Get a tailored AI deployment plan for your enterprise in minutes.",
    auditCta: "Get Your Free Audit Now",
  },
  es: {
    eyebrow: "Demo guiada",
    title: "Mira UpSkill USA en acción.",
    intro: "Un recorrido por los cuatro pasos: Imaginar, Educación, Seminario e Implementación.",
    videoTitle: "Demo de producto de UpSkill USA",
    auditEyebrow: "Auditoría gratis",
    auditTitle: "¿Listo para ver tu propia auditoría?",
    auditBody: "Obtén un plan de despliegue de IA adaptado a tu empresa en minutos.",
    auditCta: "Obtén tu auditoría gratis ahora",
  },
  pt: {
    eyebrow: "Demo guiada",
    title: "Veja a UpSkill USA em ação.",
    intro: "Um tour pelos quatro passos: Imaginar, Educação, Seminário e Implementação.",
    videoTitle: "Demo do produto UpSkill USA",
    auditEyebrow: "Auditoria grátis",
    auditTitle: "Pronto para ver sua própria auditoria?",
    auditBody: "Receba em minutos um plano de implantação de IA adaptado à sua empresa.",
    auditCta: "Obtenha sua auditoria grátis agora",
  },
};

export function DemoPageContent() {
  const { language } = usePortalContent();
  const copy = demoPageCopy[language];

  return (
    <>
      <section className="demo-page-section">
        <div className="section-inner demo-page-inner">
          <div>
            <div className="demo-page-label">{copy.eyebrow}</div>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>

          <div className="demo-video-card">
            <div className="demo-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
                title={copy.videoTitle}
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
              {copy.auditEyebrow}
            </span>
            <h2>{copy.auditTitle}</h2>
            <p>{copy.auditBody}</p>
            <Link className="button blue" href="/implement">
              {copy.auditCta}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
