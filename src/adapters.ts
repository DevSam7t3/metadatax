import { getGlobalSeoConfig } from "./config";
import { resolveMeta } from "./core/resolve";
import { validateMeta } from "./core/lint";
import { toHeadEntries } from "./core/serialize";
import type {
    HeadEntry,
    LintIssue,
    MetaInput,
    NextMetadataLike,
    ResolveContext,
    SeoConfig,
} from "./types";

export function createResolvedMeta(
    input: MetaInput,
    context: ResolveContext = {},
    defaults?: SeoConfig,
) {
    const cfg = defaults ?? getGlobalSeoConfig();
    const resolved = resolveMeta(input, cfg, context);
    const lintIssues =
        context.env === "production"
            ? []
            : validateMeta(resolved, cfg.lint, context);
    return { resolved, lintIssues };
}

export function createMetadata(
    defaults: SeoConfig,
    input: MetaInput = {},
    context: ResolveContext = {},
): NextMetadataLike {
    const { resolved, lintIssues } = createResolvedMeta(
        input,
        context,
        defaults,
    );

    if (lintIssues.length > 0) {
        for (const issue of lintIssues) {
            const prefix =
                issue.level === "error" ? "⨯ [SEO Error]" : "⚠ [SEO Warning]";
            const routeInfo = issue.routeKey
                ? ` (Route: ${issue.routeKey})`
                : "";
            const msg = `${prefix} ${issue.message}${routeInfo}`;
            if (issue.level === "error") {
                console.error(msg);
            } else {
                console.warn(msg);
            }
        }
    }

    return {
        title: resolved.title,
        description: resolved.description,
        alternates: { canonical: resolved.canonical },
        robots: resolved.robots,
        openGraph: resolved.openGraph,
        twitter: resolved.twitter,
    };
}

export function createHeadEntries(
    input: MetaInput,
    context: ResolveContext = {},
    defaults?: SeoConfig,
): {
    entries: HeadEntry[];
    lintIssues: LintIssue[];
} {
    const { resolved, lintIssues } = createResolvedMeta(
        input,
        context,
        defaults,
    );
    return { entries: toHeadEntries(resolved), lintIssues };
}
