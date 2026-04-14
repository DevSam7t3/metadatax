import type {
    MetaInput,
    OpenGraphInput,
    SeoConfig,
    TwitterInput,
} from "../types";

function mergeOpenGraph(
    base?: OpenGraphInput | null,
    over?: OpenGraphInput | null,
): OpenGraphInput | undefined {
    if (!base && !over) return undefined;
    return {
        ...(base ?? {}),
        ...(over ?? {}),
        images: over?.images ?? base?.images,
    };
}

function mergeTwitter(
    base?: TwitterInput | null,
    over?: TwitterInput | null,
): TwitterInput | undefined {
    if (!base && !over) return undefined;
    return {
        ...(base ?? {}),
        ...(over ?? {}),
    };
}

export function mergeMeta(
    defaults: SeoConfig,
    derived: Partial<MetaInput>,
    input: MetaInput,
): MetaInput {
    return {
        title:
            input.title === null
                ? undefined
                : (input.title ??
                  derived.title ??
                  defaults.title ??
                  defaults.defaultTitle),
        description:
            input.description === null
                ? undefined
                : (input.description ??
                  derived.description ??
                  defaults.description),
        canonical:
            input.canonical === null
                ? undefined
                : (input.canonical ?? defaults.canonical),
        robots:
            input.robots === null
                ? undefined
                : (input.robots ?? defaults.robots),
        openGraph: mergeOpenGraph(defaults.openGraph, input.openGraph),
        twitter: mergeTwitter(defaults.twitter, input.twitter),
        jsonLd:
            input.jsonLd === null
                ? undefined
                : (input.jsonLd ?? defaults.jsonLd),
    };
}
