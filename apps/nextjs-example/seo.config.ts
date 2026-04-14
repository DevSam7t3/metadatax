import { defineSeoConfig } from "@avenra/metadatax";

export const seo = defineSeoConfig({
    baseUrl: "https://example.com",
    titleTemplate: "%s | MetadataX Demo",
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
        strict: false,
    },
});
