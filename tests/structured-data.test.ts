import { describe, expect, test } from "vitest";
import {
    articleJsonLd,
    breadcrumbJsonLd,
    organizationJsonLd,
    productJsonLd,
} from "../src/index";

describe("structured data helpers", () => {
    test("articleJsonLd builds article schema", () => {
        const data = articleJsonLd({
            headline: "Hello",
            author: "Sam",
            datePublished: "2026-04-15",
        });

        expect(data["@type"]).toBe("Article");
        expect((data.author as { name?: string }).name).toBe("Sam");
    });

    test("breadcrumbJsonLd builds single trail", () => {
        const data = breadcrumbJsonLd({
            items: [
                { name: "Home", item: "https://example.com" },
                { name: "Docs", item: "https://example.com/docs" },
                { name: "API" },
            ],
        });

        expect(data["@type"]).toBe("BreadcrumbList");
        const entries = data.itemListElement as Array<{ position: number }>;
        expect(entries).toHaveLength(3);
        expect(entries[2].position).toBe(3);
    });

    test("breadcrumbJsonLd builds multiple trails with graph", () => {
        const data = breadcrumbJsonLd({
            multipleTrails: [
                [
                    { name: "Home", item: "https://example.com" },
                    { name: "Blog" },
                ],
                [
                    { name: "Articles", item: "https://example.com/articles" },
                    { name: "Blog" },
                ],
            ],
        });

        const graph = data["@graph"] as Array<Record<string, unknown>>;
        expect(Array.isArray(graph)).toBe(true);
        expect(graph).toHaveLength(2);
    });

    test("organizationJsonLd builds organization schema", () => {
        const data = organizationJsonLd({
            name: "Avenra",
            url: "https://example.com",
            contactPoint: { email: "hello@example.com" },
        });

        expect(data["@type"]).toBe("Organization");
        expect((data.contactPoint as { "@type"?: string })["@type"]).toBe(
            "ContactPoint",
        );
    });

    test("productJsonLd builds product with offer schema", () => {
        const data = productJsonLd({
            name: "MetadataX Pro",
            brand: "Avenra",
            offers: {
                price: 19,
                priceCurrency: "USD",
            },
        });

        expect(data["@type"]).toBe("Product");
        expect((data.brand as { name?: string }).name).toBe("Avenra");
        expect((data.offers as { "@type"?: string })["@type"]).toBe("Offer");
    });
});
