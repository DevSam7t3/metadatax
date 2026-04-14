import type { HeadEntry, ResolvedMeta } from "../types";

export function toHeadEntries(resolved: ResolvedMeta): HeadEntry[] {
    const entries: HeadEntry[] = [];

    if (resolved.title) {
        entries.push({ type: "title", content: resolved.title, key: "title" });
    }
    if (resolved.description) {
        entries.push({
            type: "meta",
            name: "description",
            content: resolved.description,
            key: "meta:description",
        });
    }
    if (resolved.canonical) {
        entries.push({
            type: "link",
            rel: "canonical",
            href: resolved.canonical,
            key: "link:canonical",
        });
    }
    if (resolved.openGraph?.url) {
        entries.push({
            type: "meta",
            property: "og:url",
            content: resolved.openGraph.url,
            key: "meta:og:url",
        });
    }
    if (resolved.openGraph?.type) {
        entries.push({
            type: "meta",
            property: "og:type",
            content: resolved.openGraph.type,
            key: "meta:og:type",
        });
    }
    if (resolved.openGraph?.siteName) {
        entries.push({
            type: "meta",
            property: "og:site_name",
            content: resolved.openGraph.siteName,
            key: "meta:og:site_name",
        });
    }

    resolved.openGraph?.images?.forEach((img, index) => {
        entries.push({
            type: "meta",
            property: "og:image",
            content: img.url,
            key: `meta:og:image:${index}`,
        });
    });

    if (resolved.twitter?.card) {
        entries.push({
            type: "meta",
            name: "twitter:card",
            content: resolved.twitter.card,
            key: "meta:twitter:card",
        });
    }
    if (resolved.twitter?.site) {
        entries.push({
            type: "meta",
            name: "twitter:site",
            content: resolved.twitter.site,
            key: "meta:twitter:site",
        });
    }

    if (resolved.jsonLd?.length) {
        resolved.jsonLd.forEach((node, index) => {
            entries.push({
                type: "script",
                scriptType: "application/ld+json",
                json: JSON.stringify(node),
                key: `jsonld:${index}`,
            });
        });
    }

    return entries;
}
