import type { Metadata } from "next";
import { JsonLd, createMetadata, organizationJsonLd } from "@avenra/metadatax";
import { seo } from "../../seo.config";

export const metadata: Metadata = createMetadata(seo, {
    title: "About",
    canonical: "/about",
    description: "Learn about the MetadataX demo company and team.",
});

export default function AboutPage() {
    const org = organizationJsonLd({
        name: "MetadataX",
        type: "OnlineStore",
        url: "https://example.com",
        logo: "https://example.com/logo.png",
        description:
            "Metadata and structured data tooling for modern React apps.",
        sameAs: [
            "https://github.com/avenra/metadatax",
            "https://x.com/metadatax",
        ],
        contactPoint: {
            contactType: "customer support",
            email: "support@example.com",
        },
    });

    return (
        <main>
            <JsonLd data={org} />
            <h1>About MetadataX</h1>
            <p>
                This route demonstrates `organizationJsonLd` with a simple,
                route-local setup.
            </p>
        </main>
    );
}
