import { describe, expect, test } from "vitest";
import { createResolvedMeta, defineSeoConfig } from "../src/index";
import { __resetLintRegistryForTests } from "../src/core/lint";

describe("seo linting engine", () => {
    test("warns on missing canonical and og image", () => {
        __resetLintRegistryForTests();

        const cfg = defineSeoConfig({
            lint: { strict: false },
        });

        const { lintIssues } = createResolvedMeta(
            { title: "A title" },
            { routeKey: "/a", env: "development" },
            cfg,
        );

        expect(lintIssues.some((i) => i.code === "missing_canonical")).toBe(
            true,
        );
        expect(lintIssues.some((i) => i.code === "missing_og_image")).toBe(
            true,
        );
        expect(lintIssues.every((i) => i.level === "warn")).toBe(true);
    });

    test("strict mode escalates to error", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            title: "Strict defaults",
            description: "Strict defaults description",
            canonical: "https://example.com/strict-defaults",
            openGraph: { images: [{ url: "https://example.com/default.png" }] },
            lint: { strict: true },
        });

        const { lintIssues } = createResolvedMeta(
            {
                title: "A very long title that intentionally exceeds sixty characters for lint validation",
            },
            { routeKey: "/strict", env: "development" },
            cfg,
        );

        const titleIssue = lintIssues.find((i) => i.code === "title_too_long");
        expect(titleIssue?.level).toBe("error");
    });

    test("detects duplicate titles across routes in dev registry", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            lint: { strict: false },
        });

        createResolvedMeta(
            {
                title: "Unique Duplicate Marker 42",
                canonical: "https://example.com/one",
                openGraph: { images: [{ url: "https://example.com/1.png" }] },
            },
            { routeKey: "/one", env: "development" },
            cfg,
        );

        const { lintIssues } = createResolvedMeta(
            {
                title: "Unique Duplicate Marker 42",
                canonical: "https://example.com/two",
                openGraph: { images: [{ url: "https://example.com/2.png" }] },
            },
            { routeKey: "/two", env: "development" },
            cfg,
        );

        expect(lintIssues.some((i) => i.code === "duplicate_title")).toBe(true);
    });

    test("supports custom title length threshold", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            lint: {
                strict: false,
                rules: {
                    titleLength: 100,
                },
            },
        });

        const { lintIssues } = createResolvedMeta(
            {
                title: "A very long title that intentionally exceeds sixty characters but should pass under one hundred",
                canonical: "https://example.com/threshold",
                openGraph: { images: [{ url: "https://example.com/og.png" }] },
                description: "desc",
            },
            { routeKey: "/threshold", env: "development" },
            cfg,
        );

        expect(lintIssues.some((i) => i.code === "title_too_long")).toBe(false);
    });

    test("can disable title length rule", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            title: "Strict defaults",
            description: "Strict defaults description",
            canonical: "https://example.com/no-title-defaults",
            openGraph: { images: [{ url: "https://example.com/default.png" }] },
            lint: {
                strict: true,
                rules: {
                    titleLength: false,
                },
            },
        });

        const { lintIssues } = createResolvedMeta(
            {
                title: "A very long title that intentionally exceeds sixty characters and should never emit this rule",
                canonical: "https://example.com/no-title-length",
                openGraph: { images: [{ url: "https://example.com/og.png" }] },
                description: "desc",
            },
            { routeKey: "/no-title-length", env: "development" },
            cfg,
        );

        expect(lintIssues.some((i) => i.code === "title_too_long")).toBe(false);
    });

    test("rule override can downgrade strict errors", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            title: "Strict defaults",
            description: "Strict defaults description",
            canonical: "https://example.com/override-defaults",
            openGraph: { images: [{ url: "https://example.com/default.png" }] },
            lint: {
                strict: true,
                rules: {
                    title_too_long: "warn",
                },
            },
        });

        const { lintIssues } = createResolvedMeta(
            {
                title: "This title is intentionally made longer than sixty characters to exercise severity override",
                description: "desc",
                openGraph: { images: [{ url: "https://example.com/og.png" }] },
                canonical: "https://example.com/override",
            },
            { routeKey: "/override", env: "development" },
            cfg,
        );

        const titleIssue = lintIssues.find(
            (issue) => issue.code === "title_too_long",
        );
        expect(titleIssue?.level).toBe("warn");
    });

    test("rule override can disable duplicate title check", () => {
        __resetLintRegistryForTests();
        const cfg = defineSeoConfig({
            title: "Strict defaults",
            description: "Strict defaults description",
            canonical: "https://example.com/dup-defaults",
            openGraph: { images: [{ url: "https://example.com/default.png" }] },
            lint: {
                strict: true,
                rules: {
                    duplicate_title: false,
                },
            },
        });

        createResolvedMeta(
            {
                title: "No Duplicate Rule",
                description: "desc",
                canonical: "https://example.com/no-dup-1",
                openGraph: { images: [{ url: "https://example.com/og1.png" }] },
            },
            { routeKey: "/no-dup-1", env: "development" },
            cfg,
        );

        const { lintIssues } = createResolvedMeta(
            {
                title: "No Duplicate Rule",
                description: "desc",
                canonical: "https://example.com/no-dup-2",
                openGraph: { images: [{ url: "https://example.com/og2.png" }] },
            },
            { routeKey: "/no-dup-2", env: "development" },
            cfg,
        );

        expect(
            lintIssues.some((issue) => issue.code === "duplicate_title"),
        ).toBe(false);
    });
});
