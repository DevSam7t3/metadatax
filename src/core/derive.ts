import type { AutoConfig, MetaInput, ResolveContext } from "../types";

function titleCase(input: string): string {
    return input
        .split(/\s+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join(" ");
}

function deriveTitleFromPath(pathname?: string): string | undefined {
    if (!pathname) return undefined;
    const clean = pathname.split("?")[0].split("#")[0];
    const segments = clean.split("/").filter(Boolean);
    const raw = segments.length ? segments[segments.length - 1] : "home";
    const normalized = raw.replace(/[-_]+/g, " ").trim();
    if (!normalized) return undefined;
    return titleCase(normalized);
}

function extractDescription(
    auto: AutoConfig | undefined,
    ctx: ResolveContext,
): string | undefined {
    if (!auto?.descriptionFromContent) return undefined;
    const source = auto.contentExtractor?.(ctx) ?? ctx.contentText;
    if (!source) {
        // Fallback for environments where body content is not available at metadata time.
        const fallback = (ctx.h1 ?? deriveTitleFromPath(ctx.pathname))?.trim();
        return fallback ? `${fallback} page` : undefined;
    }
    const compact = source.replace(/\s+/g, " ").trim();
    if (!compact) return undefined;
    return compact.slice(0, 160);
}

export function deriveMeta(
    input: MetaInput,
    auto: AutoConfig | undefined,
    ctx: ResolveContext,
): Partial<MetaInput> {
    const out: Partial<MetaInput> = {};

    if (!input.title) {
        if (auto?.titleFromH1 && ctx.h1) {
            out.title = ctx.h1.trim();
        } else if (auto?.titleFromPath) {
            out.title = deriveTitleFromPath(ctx.pathname);
        }
    }

    if (!input.description) {
        const description = extractDescription(auto, ctx);
        if (description) out.description = description;
    }

    return out;
}
