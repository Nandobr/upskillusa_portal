import type { Metadata } from "next";

const siteUrl = "https://upskillusa-portal.vercel.app";
const siteName = "UpSkill USA";

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function createPageMetadata({ title, description, path = "/" }: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export const appMetadata = {
  siteUrl,
  siteName,
};
