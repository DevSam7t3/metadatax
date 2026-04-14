import type { Metadata } from "next";
import { JsonLd, articleJsonLd, createMetadata } from "@avenra/metadatax";
import { seo } from "../../../seo.config";

type PageProps = {
    params: Promise<{ slug: string }>;
};

function humanizeSlug(slug: string): string {
    return slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const title = humanizeSlug(slug);

    return createMetadata(
        seo,
        {
            // title,
            canonical: `/blog/${slug}`,
            openGraph: {
                type: "article",
                url: `/blog/${slug}`,
                images: [{ url: `/og/${slug}.png` }],
            },
            // description: `${title} article page generated in the example app.`,
        },
        {
            pathname: `/blog/${slug}`,
            routeKey: `/blog/${slug}`,
            env: "development",
        },
    );
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const title = humanizeSlug(slug);

    return (
        <main>
            <JsonLd
                data={articleJsonLd({
                    headline: title,
                    description: `${title} article page generated in the example app.`,
                    datePublished: "2026-04-13",
                    author: "MetadataX Team",
                    image: `https://example.com/og/${slug}.png`,
                    url: `https://example.com/blog/${slug}`,
                })}
            />
            <h1>{title}</h1>
            <p>
                This page demonstrates App Router metadata + JSON-LD with
                @avenra/metadatax.
            </p>
        </main>
    );
}
