import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ergastirio Manager",
    short_name: "Ergastirio",
    description: "Ergastirio Manager PWA",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    icons: [
      { src: "/logo192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
