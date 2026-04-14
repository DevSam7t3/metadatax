import { describe, expect, test } from "vitest";
import {
    defineSeoConfig,
    createResolvedMeta,
    createMetadata,
} from "../src/index";

describe("smart defaults engine", () => {
    test("derives title from path when missing", () => {
        const cfg = defineSeoConfig({
            baseUrl: "https://example.com",
            auto: { titleFromPath: true },
        });

        const { resolved } = createResolvedMeta(
            {
                canonical: "/blog/my-first-post",
            },
            { pathname: "/blog/my-first-post", env: "development" },
            cfg,
        );

        expect(resolved.title).toBe("My First Post");
    });

    test("uses h1 over pathname when enabled", () => {
        const cfg = defineSeoConfig({
            auto: { titleFromPath: true, titleFromH1: true },
        });

        const { resolved } = createResolvedMeta(
            {},
            {
                pathname: "/docs/intro",
                h1: "Getting Started",
                env: "development",
            },
            cfg,
        );

        expect(resolved.title).toBe("Getting Started");
    });

    test("derives description from content excerpt", () => {
        const cfg = defineSeoConfig({
            auto: { descriptionFromContent: true },
        });

        const { resolved } = createResolvedMeta(
            {},
            {
                contentText:
                    "This is a long paragraph that should be used as fallback SEO description when developers forget to provide one.",
                env: "development",
            },
            cfg,
        );

        expect(resolved.description).toContain("This is a long paragraph");
    });

    test("derives title from canonical path when context pathname is missing", () => {
        const cfg = defineSeoConfig({
            titleTemplate: "%s | Demo",
            auto: { titleFromPath: true },
        });

        const metadata = createMetadata(cfg, {
            canonical: "/docs/quick-start",
        });
        expect(metadata.title).toBe("Quick Start | Demo");
    });

    test("falls back description from path when content source is unavailable", () => {
        const cfg = defineSeoConfig({
            auto: { titleFromPath: true, descriptionFromContent: true },
        });

        const { resolved } = createResolvedMeta(
            { canonical: "/blog/hello-world" },
            { env: "development" },
            cfg,
        );

        expect(resolved.description).toBe("Hello World page");
    });
});
