import { defineSeoConfig } from "@avenra/metadatax";

export const seo = defineSeoConfig({
    baseUrl: "https://example.com",
    titleTemplate: "%s | MetadataX Demo",
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
