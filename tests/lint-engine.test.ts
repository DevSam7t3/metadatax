import { describe, expect, test } from "vitest";
import { createResolvedMeta, defineSeoConfig } from "../src/index";

describe("seo linting engine", () => {
    test("warns on missing canonical and og image", () => {
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
        const cfg = defineSeoConfig({
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
});
