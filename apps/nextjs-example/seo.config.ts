import { defineSeoConfig } from "@avenra/metadatax";

export const seo = defineSeoConfig({
    titleTemplate: "%s | MetadataX Demo",
    baseUrl: "https://example.com",
    title: "MetadataX Demo",
    description: "Demo site for MetadataX Next.js integration.",
    canonical: "/",
    openGraph: {
        type: "website",
        siteName: "MetadataX Demo",
        images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@metadatax",
    },
    auto: {
        titleFromPath: true,
        descriptionFromContent: true,
    },
    lint: {
        strict: true,
        rules: {
            titleLength: 100,
            missing_og_image: "error",
        },
    },
});
