import type { Metadata } from "next";
import {
    JsonLd,
    breadcrumbJsonLd,
    createMetadata,
    productJsonLd,
} from "@avenra/metadatax";
import { seo } from "../../../seo.config";

type ProductPageProps = {
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
}: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const name = humanizeSlug(slug);

    return createMetadata(seo, {
        title: name,
        canonical: `/products/${slug}`,
        description: `${name} product page generated in the example app.`,
        openGraph: {
            type: "website",
            images: [{ url: `/og/products/${slug}.png` }],
        },
    });
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const name = humanizeSlug(slug);

    const product = productJsonLd({
        name,
        description: `${name} product page generated in the example app.`,
        image: [`https://example.com/og/products/${slug}.png`],
        sku: `SKU-${slug.toUpperCase()}`,
        brand: "MetadataX",
        offers: {
            price: "49.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `https://example.com/products/${slug}`,
        },
    });

    const breadcrumb = breadcrumbJsonLd({
        items: [
            { name: "Home", item: "https://example.com" },
            { name: "Products", item: "https://example.com/products" },
            { name, item: `https://example.com/products/${slug}` },
        ],
    });

    return (
        <main>
            <JsonLd data={[product, breadcrumb]} />
            <h1>{name}</h1>
            <p>
                This route demonstrates `productJsonLd` and `breadcrumbJsonLd`
                in the same page.
            </p>
        </main>
    );
}
