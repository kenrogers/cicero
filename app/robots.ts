import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cicero.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/admin/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/meetings/", "/blog/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/meetings/", "/blog/"],
      },
      {
        userAgent: "Amazonbot",
        allow: ["/", "/meetings/", "/blog/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
