"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { languages } from "@/lib/content";
import { LanguageProvider, usePortalContent } from "@/components/language-provider";

function ShellFrame({ children }: { children: ReactNode }) {
  const { content, language, setLanguage } = usePortalContent();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const jfkLines = content.brand.jfkLine.split(". ").map((line, index, lines) => {
    if (index < lines.length - 1 && !line.endsWith(".")) {
      return `${line}.`;
    }

    return line;
  });

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand-link" href="/" aria-label={content.ui.homeAriaLabel}>
            <Image
              src="/assets/upskill-usa-logo.png"
              alt="UpSkill USA"
              width={190}
              height={72}
              className="brand-logo"
              priority
            />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {content.nav.slice(1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  className={active ? "nav-pill active" : "nav-pill"}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <div className="language-toggle" aria-label={content.ui.languageLabel}>
              {languages.map((option) => (
                <button
                  key={option}
                  className={language === option ? "language-option active" : "language-option"}
                  type="button"
                  onClick={() => setLanguage(option)}
                  aria-pressed={language === option}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? content.ui.closeMenuLabel : content.ui.openMenuLabel}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
            {content.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  className={active ? "mobile-nav-link active" : "mobile-nav-link"}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-kicker">{content.brand.lockup}</p>
            <p className="footer-promise">{content.brand.promise}</p>
          </div>
          <div className="footer-lines">
            <p>{content.brand.giBillLine}</p>
            <p>
              {jfkLines.map((line) => (
                <span className="footer-line" key={line}>
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ShellFrame>{children}</ShellFrame>
    </LanguageProvider>
  );
}
