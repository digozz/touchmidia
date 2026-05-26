import type { MetadataRoute } from "next";
import { games } from "@/content/games";
import { SITE_URL } from "@/lib/contact";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_URL}/jogos`, priority: 0.9, changeFrequency: "weekly" },
    {
      url: `${SITE_URL}/como-funciona`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/politica-de-privacidade`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: `${SITE_URL}/termos-de-uso`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${SITE_URL}/jogos/${game.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...gamePages].map((page) => ({
    ...page,
    lastModified,
  }));
}
