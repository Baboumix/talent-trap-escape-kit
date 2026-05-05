import type { MetadataRoute } from "next";

const SITE_URL = "https://talent.monexpansion.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/diagnostic/resultat",
        "/diagnostic/infos",
        "/diagnostic/merci",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
