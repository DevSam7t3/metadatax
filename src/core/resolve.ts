import { deriveMeta } from "./derive";
import { mergeMeta } from "./merge";
import type {
    JsonLdNode,
    MetaInput,
    ResolvedMeta,
    ResolveContext,
    SeoConfig,
} from "../types";

function applyTitleTemplate(
    title: string | undefined,
    defaults: SeoConfig,
): string | undefined {
    if (!title) return undefined;
    if (!defaults.titleTemplate) return title;
    return defaults.titleTemplate.replace("%s", title);
}

function toJsonLdArray(value: MetaInput["jsonLd"]): JsonLdNode[] | undefined {
    if (!value) return undefined;
    const arr = Array.isArray(value) ? value : [value];
    return arr.map((node) => ({ "@context": "https://schema.org", ...node }));
}

function absolutize(
    url: string | undefined,
    baseUrl: string | undefined,
): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    if (!baseUrl) return url;
    return new URL(url, baseUrl).toString();
}

export function resolveMeta(
    input: MetaInput,
    defaults: SeoConfig,
    ctx: ResolveContext = {},
): ResolvedMeta {
    const inferredPathname =
        ctx.pathname ??
        input.canonical ??
        defaults.canonical ??
        input.openGraph?.url ??
        defaults.openGraph?.url ??
        ctx.routeKey;

    const derived = deriveMeta(input, defaults.auto, {
        ...ctx,
        pathname: inferredPathname,
    });
    const merged = mergeMeta(defaults, derived, input);
    const title = applyTitleTemplate(merged.title ?? undefined, defaults);
    const canonical = absolutize(
        merged.canonical ?? undefined,
        defaults.baseUrl,
    );

    const openGraph = merged.openGraph
        ? {
              ...merged.openGraph,
              url: absolutize(
                  merged.openGraph.url ?? canonical,
                  defaults.baseUrl,
              ),
              images: merged.openGraph.images?.map((img) => ({
                  ...img,
                  url: absolutize(img.url, defaults.baseUrl) ?? img.url,
              })),
          }
        : undefined;

    return {
        title,
        description: merged.description ?? undefined,
        canonical,
        robots: merged.robots ?? undefined,
        openGraph,
        twitter: merged.twitter ?? undefined,
        jsonLd: toJsonLdArray(merged.jsonLd),
    };
}
